import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { client } from "../utils/client.js";
import MasonryLayout from "./MasonryLayout.jsx";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner.jsx";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { RiShareForwardLine, RiPlayListAddLine } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import { Comments } from "../container/Comments.jsx";
import { MdClose } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { TbLoader2 } from "react-icons/tb";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [pinDetails, setPinDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const hasLiked = pinDetails?.likes?.some((like) => like._id === user?._id);
  const hasDisliked = pinDetails?.dislikes?.some(
    (dislike) => dislike._id === user?._id
  );

  const { pinId } = useParams();

  const fetchPinDetails = async () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      await client.fetch(query).then((data) => {
        setPinDetails(data[0]);

        //fetching related pins
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((data) => {
            setPins(data);
          });
        }
      });
    }
  };

  const handleLike = async () => {
    if (!user || isLiking || isDisliking) return;
    setIsLiking(true);

    try {
      let mutation;
      if (hasLiked) {
        // Unlike
        mutation = client
          .patch(pinDetails._id)
          .unset([`likes[_ref=="${user._id}"]`])
          .setIfMissing({ likesCount: 0 })
          .dec({ likesCount: 1 });
      } else {
        // Like and remove dislike if exists
        mutation = client
          .patch(pinDetails._id)
          .setIfMissing({ likes: [], likesCount: 0, dislikesCount: 0 })
          .insert("after", "likes[-1]", [
            {
              _key: uuidv4(),
              _type: "reference",
              _ref: user._id,
            },
          ])
          .inc({ likesCount: 1 })
          .unset([`dislikes[_ref=="${user._id}"]`])
          .dec({ dislikesCount: hasDisliked ? 1 : 0 });
      }

      await mutation.commit();
      const updatedPin = await client.fetch(pinDetailQuery(pinDetails._id));
      setPinDetails(updatedPin[0]);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user || isDisliking || isLiking) return;
    setIsDisliking(true);
    try {
      let mutation;
      if (hasDisliked) {
        // Undislike
        mutation = client
          .patch(pinDetails._id)
          .unset([`dislikes[_ref=="${user._id}"]`])
          .setIfMissing({ dislikesCount: 0 })
          .dec({ dislikesCount: 1 });
      } else {
        // disLike and remove like if exists
        mutation = client
          .patch(pinDetails._id)
          .setIfMissing({ dislikes: [], likesCount: 0, dislikesCount: 0 })
          .insert("after", "dislikes[-1]", [
            {
              _key: uuidv4(),
              _type: "reference",
              _ref: user._id,
            },
          ])
          .inc({ dislikesCount: 1 })
          .unset([`likes[_ref=="${user._id}"]`])
          .dec({ likesCount: hasLiked ? 1 : 0 });
      }

      await mutation.commit();
      const updatedPin = await client.fetch(pinDetailQuery(pinDetails._id));
      setPinDetails(updatedPin[0]);
    } catch (error) {
      console.error("Error updating dislike:", error);
    } finally {
      setIsDisliking(false);
    }
  };

  const handleShare = async () => {
    try {
      // Share logic using Web Share API
      if (navigator.share) {
        await navigator.share({
          title: pinDetails.title,
          text: pinDetails.about,
          url: window.location.href,
        });

        // Update share count
        const mutation = client
          .patch(pinDetails._id)
          .setIfMissing({ sharesCount: 0 })
          .inc({ sharesCount: 1 });

        await mutation.commit();
        const updatedPin = await client.fetch(pinDetailQuery(pinDetails._id));
        setPinDetails(updatedPin[0]);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      // Fetch image as blob
      const response = await fetch(pinDetails?.image.asset?.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create XHR to track progress
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.addEventListener("load", async () => {
        console.log("Download completed");
        try {
          const mutation = client
            .patch(pinDetails._id)
            .setIfMissing({ downloadCount: 0 })
            .inc({ downloadCount: 1 });

          await mutation.commit();
          const updatedPin = await client.fetch(pinDetailQuery(pinDetails._id));
          setPinDetails(updatedPin[0]);
        } catch (error) {
          console.error("Error updating count:", error);
        }
      });

      xhr.addEventListener("error", () => {
        console.log("Download failed");
      });

      xhr.addEventListener("abort", () => {
        console.log("Download cancelled");
      });

      xhr.open("GET", pinDetails?.image.asset?.url);
      xhr.send();

      const link = document.createElement("a");
      link.href = url;
      link.download = `${pinDetails?.title || "image"}.${
        blob.type.split("/")[1]
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchPinDetails();
    };
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, [pinId]);

  if (isLoading) return <Spinner message="Loading details" />;

  return (
    <Fragment>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[700px]">
            {/* Image Section */}
            <div className="relative xl:col-span-7 bg-gray-50">
              <img
                src={pinDetails?.image.asset?.url}
                alt={pinDetails?.title}
                className="w-full h-full max-h-[720px] object-contain cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              />
              {/* ... image overlay actions ... */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all">
                  <RiPlayListAddLine className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="cursor-pointer p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all disabled:opacity-50"
                >
                  {isDownloading ? (
                    <TbLoader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <HiOutlineDownload className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="xl:col-span-5 flex flex-1 flex-col">
              <div>
                <div className="flex w-full h-full flex-col items-start justify-between pt-4 px-4 pb-2 md:p-6 md:pb-2 space-y-8">
                  {/* Title and Stats */}
                  <div className="self-stretch">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {pinDetails?.title}
                    </h1>
                    <div className="mt-4 flex items-center gap-6 text-gray-500">
                      <span className="flex items-center gap-1">
                        <AiOutlineLike className="w-5 h-5" />
                        {pinDetails?.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <AiOutlineDislike className="w-5 h-5" />
                        {pinDetails?.dislikesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <RiShareForwardLine className="w-5 h-5" />
                        {pinDetails?.sharesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineDownload className="w-5 h-5" />
                        {pinDetails?.downloadCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex self-stretch items-center justify-between">
                    <Link
                      to={`/user-profile/${pinDetails?.postedBy?._id}`}
                      className="flex items-center gap-4 group"
                    >
                      <img
                        src={pinDetails?.postedBy?.image}
                        alt={pinDetails?.postedBy?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all"
                      />
                      <div>
                        <p className="font-medium group-hover:text-blue-600 transition-colors">
                          {pinDetails?.postedBy?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @
                          {pinDetails?.postedBy?.name
                            .toLowerCase()
                            .replace(/\s+/g, "")}
                        </p>
                      </div>
                    </Link>

                    <button className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all hover:shadow-md">
                      Follow
                    </button>
                  </div>
                  {/* Description */}
                  {pinDetails?.about && (
                    <div className="prose prose-gray max-w-none self-stretch">
                      <p className="text-gray-600 leading-relaxed">
                        {pinDetails.about}
                      </p>
                    </div>
                  )}
                  {/* Category & Tags */}
                  {pinDetails?.category && (
                    <div className="flex flex-wrap gap-2 self-stretch">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                        {pinDetails.category}
                      </span>
                      {pinDetails?.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 self-stretch">
                    <div className="flex rounded-xl bg-gray-100 divide-x divide-gray-200">
                      <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-2 px-4 py-2 rounded-l-xl transition-all cursor-pointer ${
                          hasLiked
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 "
                        }`}
                      >
                        {isLiking ? (
                          <TbLoader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <AiOutlineLike
                            className={`w-5 h-5 ${
                              hasLiked ? "fill-current" : ""
                            }`}
                          />
                        )}
                      </button>
                      <button
                        onClick={handleDislike}
                        disabled={isDisliking}
                        className={`flex items-center gap-2 px-4 py-2 rounded-r-xl transition-all cursor-pointer ${
                          hasDisliked
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {isDisliking ? (
                          <TbLoader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <AiOutlineDislike
                            className={`w-5 h-5 ${
                              hasDisliked ? "fill-current" : ""
                            }`}
                          />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:shadow-md cursor-pointer"
                        onClick={handleShare}
                      >
                        <RiShareForwardLine className="w-5 h-5" />
                      </button>

                      <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:shadow-md">
                        <RiPlayListAddLine className="w-5 h-5" />
                      </button>

                      <a
                        href={`${pinDetails?.image.asset?.url}?dl=`}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:shadow-md"
                      >
                        <HiOutlineDownload className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  {/* Comments Section */}
                  <div className="border-t min-h-[300px] max-h-[300px] self-stretch">
                    <Comments pinId={pinId} user={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pins */}
        {pins?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              More like this
            </h2>
            <MasonryLayout pins={pins} />
          </div>
        )}
      </div>
      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div className="absolute top-4 right-4 z-50 flex gap-4">
            <a
              href={`${pinDetails?.image.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              <HiOutlineDownload className="w-6 h-6 text-white" />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(false);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="h-full w-full flex items-center justify-center p-4">
            <img
              src={pinDetails?.image.asset?.url}
              alt={pinDetails?.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default PinDetails;
