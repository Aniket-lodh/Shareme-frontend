import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

import { client } from "../utils/client";

const Login = () => {
  const navigate = useNavigate();
  const createOrGetuser = async (response) => {
    const { name, picture, sub } = jwt_decode(response.credential);
    const userObj = {
      _id: sub,
      _type: "user",
      name: name,
      image: picture,
    };
    localStorage.setItem("user",sub);
    client.createIfNotExists(userObj).then((e) => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col items-center justify-center w-full h-full top-0 left-0 right-0 bg-blackOverlay">
          <div className="p-5 w-fit">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_API_TOKEN}
              onSuccess={(resp) => createOrGetuser(resp)}
              onError={() => console.log("error")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
