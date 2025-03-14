import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { client } from "../utils/client";
import { searchQuery, feedQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import { DotSpinner } from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);
  const { categoryId } = useParams();

  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const query = categoryId ? searchQuery(categoryId) : feedQuery;
      const data = await client.fetch(query);
      setPins(data);
    } catch (error) {
      console.error('Error fetching pins:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <DotSpinner message="We are adding new ideas to your feed!" />
      </div>
    );
  }

  if (!pins?.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-4">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800">No pins found</h3>
        <p className="text-gray-500 mt-2">
          {categoryId 
            ? `No pins found in ${categoryId} category` 
            : 'No pins available in your feed'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-2">
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Feed;