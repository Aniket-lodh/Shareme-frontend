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
export const DotSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex relative w-[50px] h-[50px]">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`
            absolute w-3 h-3 rounded-full 
            bg-gray-800
            animate-[fade_1.2s_linear_infinite,scale_1.2s_linear_infinite]
            ${i === 0 ? "top-0 left-0 [animation-delay:-0.99s]" : ""}
            ${i === 1 ? "top-[19px] left-0 [animation-delay:-0.07s]" : ""}
            ${i === 2 ? "top-[38px] left-0 [animation-delay:-0.53s]" : ""}
            ${i === 3 ? "top-0 left-[19px] [animation-delay:-0.23s]" : ""}
            ${i === 4 ? "top-[19px] left-[19px] [animation-delay:-0.78s]" : ""}
            ${i === 5 ? "top-[38px] left-[19px] [animation-delay:-0.99s]" : ""}
            ${i === 6 ? "top-0 left-[38px] [animation-delay:-1.08s]" : ""}
            ${i === 7 ? "top-[19px] left-[38px] [animation-delay:-0.84s]" : ""}
            ${i === 8 ? "top-[38px] left-[38px] [animation-delay:-1.15s]" : ""}
          `}
          />
        ))}
      </div>
      {message && (
        <p className="text-base text-center px-2 text-gray-800">
          {message}
        </p>
      )}
    </div>
  );
};
export default Spinner;
