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
            <div className="flex items-center justice-center gap-3 h-fit  mt-3">
              <Link
                to={`/user-profile/${pinDetails?.postedBy?._id}`}
                className="flex gap-2 items-center bg-white rounded-lg w-fit hover:text-blue-700 transition-all"
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
              <button
                type="button"
                className=" capitalize px-4 py-2 text-base sm:text-lg bg-red-500 rounded-full font-semibold text-slate-100 hover:bg-red-600 hover:text-slate-50 transition-all"
              >
                follow
              </button>
            </div>
          </div>
          <p className="mt-3">{pinDetails?.about}</p>

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
          {/* Comments Lists */}
          <Comments pinId={pinId} user={user}/>
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
