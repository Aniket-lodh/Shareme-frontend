import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import MasonryLayout from "./MasonryLayout";
import { client } from "../utils/client";
import {fetchUser} from "../utils/fetchUser";
import Spinner from "./Spinner";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
      console.log(data[0])
    });
  }, [userId]);

  useEffect(() => {
    if (text === "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  if (!user) return <Spinner message="Loading Profile..." />;

  const randomImage =
    "https://source.unsplash.com/1600x900/?nature,photography,technology";

  const logout = () => {
    googleLogout();
    localStorage.clear();
    import.meta.env.VITE_GOOGLE_API_TOKEN = "";
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              referrerPolicy="no-referrer"
              src={randomImage}
              alt="random image"
              className="w-full h-370 shadow-lg 2xl:h-510 object-cover"
            />
            <img
              referrerPolicy="no-referrer"
              src={user.image}
              alt="user-pic"
              className="rounded-full w-40 z-1 bg-white h-40 -mt-20 shadow-lg object-contain p-1"
            />
            <h1 className="font-bold text-3xl text-center mt-3">{user.name}</h1>
            <div className="absolute top-0 z-1 right-0 p-5">
              {userId === fetchUser() && (
                <button
                  type="button"
                  onClick={(e) => {
                    logout();
                  }}
                  className="bg-white rounded-full p-3 cursor-pointer outline-none shadow-md hover:shadow-xl"
                >
                  <AiOutlineLogout color="red" fontSize={24} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              saved
            </button>
          </div>
          <div className="px-2">
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className="flex justify-center items-center w-full h-40 text-xl mt-2">
                No Pins found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
