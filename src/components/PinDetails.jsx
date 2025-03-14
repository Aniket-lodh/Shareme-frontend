import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { client } from "../utils/client.js";
import MasonryLayout from "./MasonryLayout.jsx";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner.jsx";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { RiShareForwardLine, RiPlayListAddLine } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import { Comments } from "../container/Comments.jsx";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [pinDetails, setPinDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[700px]">
          {/* Image Section */}
          <div className="relative xl:col-span-7 bg-gray-50">
            <img
              src={pinDetails?.image.asset?.url}
              alt={pinDetails?.title}
              className="w-full h-full object-contain"
            />
            {/* ... image overlay actions ... */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all">
                <RiPlayListAddLine className="w-5 h-5" />
              </button>
              <a
                href={`${pinDetails?.image.asset?.url}?dl=`}
                download
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
              >
                <HiOutlineDownload className="w-5 h-5" />
              </a>
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
                      {pinDetails?.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <AiOutlineDislike className="w-5 h-5" />
                      {pinDetails?.dislikes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <RiShareForwardLine className="w-5 h-5" />
                      {pinDetails?.shares || 0}
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
                    <button className="px-4 py-2.5 flex items-center gap-2 hover:bg-gray-200 transition-colors rounded-l-xl">
                      <AiOutlineLike className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2.5 flex items-center gap-2 hover:bg-gray-200 transition-colors rounded-r-xl">
                      <AiOutlineDislike className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:shadow-md">
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
  );
};

export default PinDetails;
