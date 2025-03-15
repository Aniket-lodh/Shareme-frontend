import { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { client } from "../utils/client";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { LuHeart, LuTrash2 } from "react-icons/lu";
import { fetchUser } from "../utils/fetchUser.js";
import { TbLoader2 } from "react-icons/tb";

const Pin = ({ pin }) => {
  const { _id, image, postedBy, destination, wishlists } = pin;
  const [postHovered, setPostHovered] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const userId = fetchUser();
  const navigate = useNavigate();

  const alreadySaved = !!wishlists?.filter((item) => item?._id === userId)
    ?.length;
  //  id:1 and savedBy:[4,1,5] => [1] => 1 => !1 => false => !false => true
  //  id:6 and savedBy:[4,1,5] => [] => 0 => !0 => true => !true => false

  const savePin = useCallback(
    async (id) => {
      if (!alreadySaved && !savingPin) {
        try {
          setSavingPin(true);
          await client
            .patch(id)
            .setIfMissing({ wishlists: [] })
            .insert("after", "wishlists[-1]", [
              {
                _key: uuidv4(),
                _type: "reference",
                _ref: userId,
              },
            ])
            .commit();
          window.location.reload();
        } catch (error) {
          console.error("Error saving pin:", error);
        } finally {
          setSavingPin(false);
        }
      }
    },
    [alreadySaved, savingPin, userId]
  );

  const deletePin = useCallback(async (id) => {
    try {
      await client.delete(id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  }, []);

  const handlePinClick = () => navigate(`/pin-details/${_id}`);

  return (
    <div className="m-2 group relative">
      <div
        className="relative cursor-zoom-in w-auto overflow-hidden transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl ease-in-out"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={handlePinClick}
      >
        <img
          src={image?.asset.url}
          alt="Pin content"
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
          loading="lazy"
        />

        <div
          className={`absolute flex w-full h-full items-center justify-between flex-col inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 p-4 transition-all duration-300 ease-in-out ${
            postHovered ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <a
              href={`${image?.asset.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex px-2 py-2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
              aria-label="Download image"
            >
              <MdOutlineFileDownload className="h-4 w-4 text-gray-700" />
            </a>

            <div className="group/save rounded-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  savePin(_id);
                }}
                disabled={savingPin || alreadySaved}
                className={`relative flex items-center justify-center gap-2 rounded-full px-2 py-2 shadow-lg backdrop-blur-sm transition-all ${
                  alreadySaved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white/90 text-gray-700 hover:bg-white"
                } ${
                  savingPin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-label={
                  alreadySaved ? "Saved to collection" : "Save to collection"
                }
              >
                {savingPin ? (
                  <TbLoader2 className="h-4 w-4 animate-spin" />
                ) : alreadySaved ? (
                  <LuHeart className="h-4 w-4 fill-current" />
                ) : (
                  <LuHeart className="h-4 w-4" />
                )}
                <span className="absolute w-fit h-fit mr-1 right-full px-2 py-1 bg-black/75 text-white text-xs rounded opacity-0 group-hover/save:opacity-100 transition-opacity whitespace-nowrap">
                  {savingPin ? "Saving..." : alreadySaved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex w-full justify-between items-center gap-2 mt-2">
            {destination && (
              <div className="relative group/dest">
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center rounded-full bg-white/90 px-2 py-2 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                  aria-label="Visit destination"
                >
                  <IoArrowUpCircleOutline className="h-4 w-4" />
                </a>
                <span className="absolute w-fit h-fit ml-1 top-0 -translate-y-1/2 left-full right-0 px-2 py-1 bg-black/75 text-white text-xs rounded opacity-0 group-hover/dest:opacity-100 transition-opacity whitespace-nowrap">
                  Visit
                </span>
              </div>
            )}

            {postedBy?._id === userId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(_id);
                }}
                className="flex px-2 py-2 items-center justify-center rounded-full cursor-pointer bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                aria-label="Delete pin"
              >
                <LuTrash2 className="h-4 w-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex items-center gap-3 mt-3 group"
      >
        <img
          src={postedBy?.image}
          alt={postedBy?.name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {postedBy?.name}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
