import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { client, urlFor } from "../utils/client";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete,AiOutlineHeart,AiFillHeart } from "react-icons/ai";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { fetchUser } from "../utils/fetchUser.js";
import { userQuery } from "../utils/data.js";

const Pin = ({ pin: {_id, image, postedBy, destination, wishlists } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const userId = fetchUser();
  const navigate = useNavigate();

  const alreadySaved = !!wishlists?.filter((item) => item?._id === userId)
    ?.length;
  //  id:1 and savedBy:[4,1,5] => [1] => 1 => !1 => false => !false => true
  //  id:6 and savedBy:[4,1,5] => [] => 0 => !0 => true => !true => false
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPin(true);
      client
        .patch(id)
        .setIfMissing({ wishlists: [] })
        .insert("after", "wishlists[-1]", [
          {
            _key: uuidv4,
            _type: "reference",
            _ref: userId,
          },
        ])
        .commit()
        .then((data) => {
          window.location.reload();
          setSavingPin(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all"
        onMouseEnter={() => setPostHovered(!postHovered)}
        onMouseLeave={() => setPostHovered(!postHovered)}
        onClick={() => navigate(`/pin-details/${_id}`)}
      >
        <img
          src={image?.asset.url}
          alt="user-post"
          className="rounded-lg w-full"
        />
        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-2 z-7250">
            <div className="flex items-center justify-between">
              <div className="flex">
                <a
                  href={`${image?.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white flex w-9 h-9 justify-center items-center text-black font-bold p-1 rounded-full opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline fontSize={20} />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiFillHeart fontSize={24}/>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiOutlineHeart fontSize={24}/>
                </button>
              )}
            </div>
            <div className="flex justify-between items-center w-full px-0.5 gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white flex items-center text-black font-bold p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpCircleFill />
                </a>
              )}
              {postedBy?._id === userId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white font-bold text-black p-2 w-9 h-9 flex items-center justify-center opacity-70 hover:opacity-100  text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          referrerPolicy="no-referrer"
          src={postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-medium capitalize">{postedBy?.name}</p>
      </Link>
    </div>
  );
};

export default Pin;
