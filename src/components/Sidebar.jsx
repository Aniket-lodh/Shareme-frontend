import { memo } from "react";
import { NavLink, Link, useSearchParams } from "react-router-dom";
import { RiHomeFill, RiUserLine } from "react-icons/ri";
import { IoCompassOutline } from "react-icons/io5";
import logo from "../assets/logo.png";
import { categories } from "../utils/data";

const navStyles = {
  base: "flex items-center px-5 py-2 gap-3 transition-all duration-200 ease-in-out rounded-lg mx-2",
  active: "bg-gray-100 text-black font-medium",
  inactive: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
};

const Sidebar = memo(({ user, closeToggle }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCloseSidebar = () => {
    setSearchParams({});
    closeToggle?.(false);
  };

  return (
    <aside className="flex flex-col h-screen bg-white border-r border-gray-100 w-64 select-none">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Logo */}
        <Link
          to="/"
          className="flex px-5 py-4 items-center"
          onClick={handleCloseSidebar}
        >
          <img
            src={logo}
            alt="ShareMe Logo"
            className="h-8 object-contain"
            loading="eager"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navStyles.base} ${
                isActive ? navStyles.active : navStyles.inactive
              }`
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          {/* Categories Section */}
          <div className="mt-8">
            <div className="px-3 mb-4 flex items-center">
              <IoCompassOutline className="w-5 h-5 text-gray-400" />
              <h3 className="ml-2 text-sm font-medium text-gray-600">
                Discover Categories
              </h3>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {categories.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/category/${category.name}`}
                  className={({ isActive }) =>
                    `${navStyles.base} ${
                      isActive ? navStyles.active : navStyles.inactive
                    }`
                  }
                  onClick={handleCloseSidebar}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-6 h-6 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <span className="capitalize text-sm">{category.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        {user && (
          <div className="border-t border-gray-100 p-4">
            <Link
              to={`user-profile/${user._id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleCloseSidebar}
            >
              <img
                src={user.image}
                className="w-8 h-8 rounded-full object-cover"
                alt={user.name}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
              </div>
              <RiUserLine className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
