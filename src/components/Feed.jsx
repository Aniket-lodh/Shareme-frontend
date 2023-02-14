import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../utils/client";
import { searchQuery, feedQuery } from "../utils/data";
import Masonrylayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  return (
    <div>
      {(pins?.length > 0) ? (
        <Masonrylayout pins={pins} />
      ) : (
        <p>No Pins exists with this category!</p>
      )}
    </div>
  );
};

export default Feed;
