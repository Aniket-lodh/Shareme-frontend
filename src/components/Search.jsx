import { useState, useEffect } from "react";
import { client } from "../utils/client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      let query = searchQuery(searchTerm.toLowerCase());
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
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message={"Searching for pins... "} />}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {!loading && searchTerm !== " " && pins?.length === 0 && (
        <div className="mt-10 text-center text-xl">No pins found! </div>
      )}
    </div>
  );
};

export default Search;
