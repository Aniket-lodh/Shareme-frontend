import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { client } from "../utils/client";
import { useToast } from "../context/Toast";
import { config } from "../utils/variables";

// lazy loading video and images.
const shareVideo = new URL("../assets/share.mp4", import.meta.url).href;
const logo = new URL("../assets/logowhite.png", import.meta.url).href;

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const createOrGetuser = useCallback(
    async (response) => {
      try {
        const { name, picture, sub } = jwt_decode(response.credential);

        const userObj = {
          _id: sub,
          _type: "user",
          name,
          image: picture,
        };

        localStorage.setItem("user", sub);
        await client.createIfNotExists(userObj);
        toast.success("Successfully signed in!");
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Failed to login, please try again later!");
      }
    },
    [navigate, toast]
  );

  const handleError = useCallback(
    (error) => {
      console.error("Google OAuth Error:", error);
      toast.error("Google signin failed, please try again!");
    },
    [toast]
  );

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
            <img
              src={logo}
              alt="logo"
              width="130"
              height="40"
              loading="eager"
            />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={config.googleClientId}
              onSuccess={(resp) => createOrGetuser(resp)}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
