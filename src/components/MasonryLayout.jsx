import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="animate-slide-fwd flex" breakpointCols={breakpointObj}>
      {pins.map((pin,index) => (
        <Pin key={index} pin={pin}/>
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
