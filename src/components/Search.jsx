import { useState, useEffect, useCallback } from "react";
import { client } from "../utils/client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import { DotSpinner } from "./Spinner";
import { RiSearchLine } from "react-icons/ri";
import { useToast } from "../context/Toast";

const Search = ({ searchTerm }) => {
  const toast = useToast();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const query = searchTerm
        ? searchQuery(searchTerm.toLowerCase())
        : feedQuery;

      const data = await client.fetch(query);
      setPins(data);
    } catch (error) {
      console.error("Error fetching pins:", error);
      toast.error("Couldn't fetch all pins, please try again later!");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <DotSpinner message="Searching for pins..." />
      </div>
    );
  }

  if (!pins?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RiSearchLine className="w-16 h-16 text-gray-300" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">No pins found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : "Try searching for something else"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      {searchTerm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing results for "{searchTerm}"
          </h2>
          <p className="text-gray-500 mt-1">
            Found {pins.length} {pins.length === 1 ? "pin" : "pins"}
          </p>
        </div>
      )}
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Search;
