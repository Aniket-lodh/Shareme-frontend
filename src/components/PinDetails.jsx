import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client } from "../utils/client.js";
import MasonryLayout from "./MasonryLayout.jsx";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner, { Loader } from "./Spinner.jsx";
import CommentsList from "./commentsList.jsx";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { RiShareForwardLine, RiPlayListAddLine } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [pinDetails, setPinDetails] = useState(null);
  const [addingComment, setAddingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const { pinId } = useParams();
  const commentRef = useRef(null);

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

  const addComment = async () => {
    if (
      commentRef.current.value !== undefined &&
      commentRef.current.value !== "" &&
      commentRef.current.value !== null
    ) {
      setAddingComment(true);
      await client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment: commentRef.current.value,
            _key: `${uuidv4()}`,
            postedBy: {
              _type: "reference",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setIsLoadingComments(true);
          commentRef.current.value = null;

          fetchPinDetails().then(() => {
            setAddingComment(false);
            setIsLoadingComments(false);
          });
        });
    } else setAddingComment(false);
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
    <>
      <div
        className=" flex xl:flex-row flex-col m-auto bg-white shadow-md min-h-350 h-fit"
        style={{ maxWidth: "1000px", borderRadius: "32px" }}
      >
        <div className="flex items-center justify-center md:items-start flex-initial p-2">
          <img
            src={pinDetails?.image.asset && pinDetails?.image.asset.url}
            alt="user-image"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>

        <div className="p-5 pt-3 h-fit flex-1 xl:min-w-470">
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetails?.title}
            </h1>
            <p className="mt-3">{pinDetails?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetails?.postedBy?._id}`}
            className="flex gap-2 mt-3 items-center bg-white rounded-lg w-fit hover:text-blue-700 transition-all"
          >
            <img
              referrerPolicy="no-referrer"
              src={pinDetails?.postedBy?.image}
              alt="pin-creator"
              className="w-11 h-11 rounded-full object-cover border"
            />
            <p className="font-medium capitalize text-base">
              {pinDetails?.postedBy?.name}
            </p>
          </Link>

          <div className="w-full mt-3 flex items-start gap-3 flex-wrap">
            <div className="divide-x flex items-center justify-center rounded-lg bg-gray-100 text-base">
              <div className="transition-all flex items-center rounded-l-lg justify-center cursor-pointer p-4 gap-2 hover:bg-gray-200">
                <AiOutlineLike fontSize={20} /> {0}
              </div>
              <div className="transition-all flex items-center rounded-r-lg justify-center cursor-pointer p-4 gap-2 hover:bg-gray-200">
                <AiOutlineDislike fontSize={20} /> {0}
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 p-2 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all">
              <a
                target="_blank"
                href={window.location.href}
                title="share"
                className="flex capitalize items-center justify-center gap-3 p-2 text-base"
              >
                <RiShareForwardLine fontSize={20} /> {"share"}
              </a>
            </div>
            <div className="p-2 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
              <div className="p-2 capitalize flex items-center justify-center gap-3 ">
                <RiPlayListAddLine fontSize={20} /> {"save"}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg transition-all bg-gray-100 hover:bg-gray-200 cursor-pointer">
              <a
                href={
                  pinDetails?.image.asset &&
                  `${pinDetails?.image.asset.url}?dl=`
                }
                download
                onClick={(e) => e.stopPropagation()}
                className="flex capitalize items-center justify-center p-4 gap-3"
              >
                <HiOutlineDownload fontSize={20} /> {"Download"}
              </a>
            </div>
          </div>

          <div className="bg-gray-100 mt-3 px-2 pb-3 rounded-xl rounded-b-5xl flex flex-col items-start justify-between h-fit w-full">
            <details className="w-full">
              <summary className="mt-5 text-2xl mb-2 cursor-pointer ">
                {pinDetails?.comments ? pinDetails?.comments.length : "0"}{" "}
                Comments
              </summary>
              <div className="max-h-370 w-full overflow-y-auto scrollbar-hidden px-3 pb-4">
                {isLoadingComments && (
                  <Spinner message={"loading comments..."} />
                )}

                {!isLoadingComments &&
                  pinDetails?.comments &&
                  pinDetails?.comments.map((comment, index) => (
                    <div key={index} className="w-full">
                      <CommentsList
                        comment={comment}
                        index={index}
                        user={user}
                      />
                    </div>
                  ))}
                {!isLoadingComments && !pinDetails?.comments && (
                  <div className="flex w-full items-center justify-center mt-6">
                    <p className="text-xl font-medium">No Comments</p>
                  </div>
                )}
              </div>
            </details>
{/* TODO: fix the post comment button layout for mobile devices */}
            <div className="sticky bg-white -bottom-2 rounded-full px-4 py-3 flex gap-3 items-center justify-center w-full drop-shadow-md">
              <input
                type="text"
                className="w-3/5 flex-auto border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment"
                ref={commentRef}
                onKeyDown={(e) => {
                  if (e.code === "Enter") addComment();
                }}
              />
              <button
                type="button"
                className="w-1/5 md:w-auto flex-initial bg-red-500 text-white rounded-full px-3 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? <Loader /> : "post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <>
          <h2 className="text-center font-bold text-2xl mb-8 mt-6">
            More Like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
};

export default PinDetails;
