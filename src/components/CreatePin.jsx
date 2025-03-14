import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../utils/client.js";
import { categories } from "../utils/data.js";
import Spinner from "./Spinner.jsx";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();
  const uploadImage = (e) => {
    setLoading(true);
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((err) => console.error(`Error Uploading file: ` + err));
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pins",
        title,
        about,
        destination,
        category,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "reference",
          _ref: user._id,
        },
      };
      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Image Upload Section */}
          <div className="flex flex-col">
            <div
              className={`
              relative flex items-center justify-center
              border-2 border-dashed border-gray-300 rounded-2xl
              transition-all duration-300 
              ${!imageAsset ? "hover:border-blue-400 hover:bg-blue-50/50" : ""}
              aspect-square
            `}
            >
              {wrongImageType && (
                <p className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
                  Wrong image format
                </p>
              )}

              {!imageAsset ? (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-8">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <AiOutlineCloudUpload className="w-12 h-12 text-gray-400" />
                      <p className="mt-4 font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="mt-2 text-sm text-gray-500 text-center">
                        High quality JPG, SVG, PNG, GIF or TIFF
                        <br />
                        Max size: 20MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={uploadImage}
                    accept="image/*"
                  />
                </label>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={imageAsset.url}
                    alt="Upload preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm
                      hover:bg-white transition-all text-gray-700"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col gap-6">
            {fields && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                Please fill in all the fields
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <img
                  src={user?.image}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <p className="font-medium">{user.name}</p>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add your title"
                className="w-full px-4 py-3 text-xl font-medium placeholder:text-gray-400
                  border-b focus:border-b-2 focus:border-blue-500 
                  transition-all outline-none"
              />

              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="What is your pin about"
                className="w-full px-4 py-3 placeholder:text-gray-400
                  border-b focus:border-b-2 focus:border-blue-500 
                  transition-all outline-none"
              />

              <input
                type="url"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Add a destination link"
                className="w-full px-4 py-3 placeholder:text-gray-400
                  border-b focus:border-b-2 focus:border-blue-500 
                  transition-all outline-none"
              />

              <div className="space-y-2">
                <label className="block font-medium text-gray-700">
                  Choose category
                </label>
                <select
                  value={category || "other"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                    transition-all outline-none"
                >
                  <option value="other">Select category</option>
                  {categories.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={savePin}
              className="self-end px-8 py-3 rounded-xl bg-red-500 text-white font-medium
                hover:bg-red-600 transition-colors"
            >
              Create Pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
