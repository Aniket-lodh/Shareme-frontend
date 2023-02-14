import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/logo.png";
import { categories } from "../utils/data";
const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all ease-in-out duration-40 capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 boder-black transition-all ease-in-out duration-40 capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col h-screen bg-white min-w-210 ">
      <div className="flex h-full flex-col justify-between" >
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5" style={{'height':'77%'}}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            home
          </NavLink>
          <h3 className="capitalize mt-2 px-5 text-base 2xl:text-xl">
            discover categories
          </h3>
          <div className="flex overflow-y-auto hide-scrollbar flex-col gap-5">
            {categories.map((item, id) => (
              <NavLink
                to={`/category/${item.name}`}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
                key={id}
              >
                <img
                  src={item.image}
                  alt="category-item"
                  className="w-8 rounded-full h-8 shadow-sm"
                />
                {item.name}
              </NavLink>
            ))}
            
          </div>
          
        </div>
        {user && (
              <Link
                to={`user-profile/${user._id}`}
                className="flex h-14 items-center my-5 mb-3 gap-2 p-2 bg-white rounded-lg shadow-lg mx-3"
                onClick={handleCloseSidebar}
              >
                <img
                  referrerPolicy="no-referrer"
                  src={user?.image}
                  className="rounded-full w-10 h-10"
                  alt="user-profile"
                />
                <p>{user.name}</p>
              </Link>
            )}
      </div>
    </div>
  );
};

export default Sidebar;
