import { Circles, ColorRing } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full ">
      <Circles color="#00BFFF" height={50} width={200} className="m-5" />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};
export const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <ColorRing
        visible={true}
        height={30}
        width={30}
        colors={["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
      />
    </div>
  );
};
export default Spinner;
