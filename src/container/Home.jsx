import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import { Sidebar } from "../components";
import { client, urlFor } from "../utils/client";
import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser.js";
import Pins from "../container/Pins";
import logo from "../assets/logo.png";
import UserProfile from "../components/UserProfile";

const Home = () => {
  const [toggleSidebar, settoggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const userId = fetchUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const query = userQuery(userId);
        const data = await client.fetch(query);
        setUser(data[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className="h-screen relative flex-col transition-height duration-75 ease-out md:flex-row flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen">
        <Sidebar user={user} />
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden flex-row w-full">
        <header className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <button
            onClick={() => settoggleSidebar(!toggleSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <HiMenu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="ShareMe" className="w-28" />
          </Link>
          <Link
            to={`user-profile/${user?._id}`}
            className="w-10 h-10 rounded-full overflow-hidden"
          >
            {user?.image && (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
          </Link>
        </header>

        {/* Mobile Sidebar */}
        {toggleSidebar && (
          <div
            className="fixed inset-0 z-50 bg-black/50 transition-colors duration-200"
            onClick={() => settoggleSidebar(!toggleSidebar)}
          >
            <div
              className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => settoggleSidebar(!toggleSidebar)}
                className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <AiFillCloseCircle className="w-6 h-6" />
              </button>
              <Sidebar
                user={user}
                closeToggle={() => settoggleSidebar(!toggleSidebar)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto scrollbar-thin" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
