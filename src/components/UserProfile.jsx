import { useState, useEffect, useCallback } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import MasonryLayout from "./MasonryLayout";
import { DotSpinner } from "./Spinner";
import { client } from "../utils/client";
import { fetchUser } from "../utils/fetchUser";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

const RANDOM_IMAGE =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchUserProfile = useCallback(async () => {
    try {
      const query = userQuery(userId);
      const data = await client.fetch(query);
      setUser(data[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [userId]);

  const fetchUserPins = useCallback(async () => {
    try {
      setLoading(true);
      const query =
        activeTab === "created"
          ? userCreatedPinsQuery(userId)
          : userSavedPinsQuery(userId);
      const data = await client.fetch(query);
      setPins(data);
    } catch (error) {
      console.error("Error fetching pins:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUserPins();
  }, [fetchUserPins]);

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!user) return <DotSpinner message="Loading Profile..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
        {/* Animated Gradient Background */}
        <section className="h-80 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 animate-gradient" />

          {/* Stats Overview */}
          <div className="absolute bottom-4 left-4 flex gap-6 text-white/90">
            <div className="text-center">
              <p className="text-2xl font-bold">{pins.length}</p>
              <p className="text-sm">Pins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">2.5k</p>
              <p className="text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1.2k</p>
              <p className="text-sm">Following</p>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8 -mt-10">
          {/* Profile Image */}
          <section className="flex justify-center">
            <div className="relative group">
              <img
                src={user.image}
                alt={user.name}
                className="w-40 h-40 rounded-2xl border-4 border-white bg-white object-cover shadow-lg cursor-pointer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 pointer-events-none" />
              {userId === fetchUser() && (
                <button
                  onClick={handleLogout}
                  className="absolute -right-2 -top-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  title="Logout"
                >
                  <AiOutlineLogout className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </section>

          {/* User Info */}
          <section className="mt-6 text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-gray-500">
              @{user.name.toLowerCase().replace(/\s+/g, "")}
            </p>
            <p className="text-gray-600 max-w-md mx-auto">
              Photography enthusiast sharing moments through pins
            </p>
          </section>

          {/* Tabs */}
          <section className="mt-8 flex justify-center gap-4">
            {["created", "saved"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  px-8 py-2.5 rounded-xl font-medium transition-all
                  ${
                    activeTab === tab
                      ? "bg-gray-900 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </section>
        </div>
      </div>

      {/* Search and Create Section */}
      <div className="mt-12 flex items-center justify-between gap-4">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder={`Search ${user.name}'s pins...`}
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 
            focus:border-blue-400 focus:ring-2 focus:ring-blue-100 
            transition-all duration-300"
          />
          <svg
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
            group-focus-within:text-blue-500 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {userId === fetchUser() && (
          <button
            onClick={() => navigate("/create-pin")}
            className="px-5 py-3 rounded-xl font-medium
        bg-gray-900 text-white 
        hover:bg-gray-800 shadow-lg
        transition-all duration-200
        flex items-center gap-2"
          >
            <span>Create Pin</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Pins Section */}
      <div className="mt-12">
        {loading ? (
          <DotSpinner message={`Loading ${activeTab} pins...`} />
        ) : pins.length > 0 ? (
          <MasonryLayout pins={pins} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-lg">No {activeTab} pins yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
