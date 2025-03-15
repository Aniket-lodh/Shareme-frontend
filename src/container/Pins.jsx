import { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import { Navbar, Feed, PinDetails, CreatePin, Search } from "../components";

const Pins = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchItem, setSearchItem] = useState("");
  const location = useLocation();
  
  useEffect(() => {
    // Clear search when not on search page
    if (!location.pathname.includes("/search")) {
      setSearchItem("");
      setSearchParams({});
    } else {
      const searchQuery = searchParams.get("query") || "";
      setSearchItem(searchQuery);
    }
  }, [location.pathname, searchParams, setSearchParams]);

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchItem}
          setSearchTerm={setSearchItem}
          user={user}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-details/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchItem} setSearchTerm={setSearchItem} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
