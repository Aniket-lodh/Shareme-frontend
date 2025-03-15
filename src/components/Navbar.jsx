import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { memo, useCallback, useEffect } from "react";

const Navbar = ({ setSearchTerm, user }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const debounceSearch = useCallback((callback, delay = 500) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }, []);

  const handleSearch = useCallback(
    debounceSearch((value) => {
      if (value) {
        navigate(`/search?query=${value}`);
      } else {
        setSearchParams({});
      }
      setSearchTerm(value);
    }),
    [navigate, setSearchParams, setSearchTerm]
  );

  // Sync URL params with search term on mount
  useEffect(() => {
    // Clear search when not on search page
    if (!location.pathname.includes("/search")) {
      setSearchTerm("");
      setSearchParams({});
    } else {
      const searchQuery = searchParams.get("query") || "";
      setSearchTerm(searchQuery);
    }
  }, [location.pathname, searchParams, setSearchParams]);

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoMdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              defaultValue={searchParams.get("query") || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparenttransition-shadow duration-200"
              placeholder="Search for amazing content..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-4  max-w-2xl border border-red-500">
            <Link
              to="create-pin"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              <IoMdAdd className="h-5 w-5" />
              <span className="hidden sm:ml-1 sm:inline">Create</span>
            </Link>

            <Link
              to={`user-profile/${user?._id}`}
              className="hidden md:block overflow-hidden rounded-xl hover:ring-2 hover:ring-gray-200 transition-all"
            >
              {user?.image && (
                <img
                  src={user.image}
                  alt={user.name || "User profile"}
                  className="h-10 w-10 object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
