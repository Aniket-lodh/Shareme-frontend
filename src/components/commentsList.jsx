import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { Loader } from "./Spinner.jsx";

const CommentsList = ({ comment, user, delComment }) => {
  const [isHoveringComment, setIsHoveringComment] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfDeleting, setIsConfDeleting] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const HandleOutsideClickListener = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setIsSettingActive(false);
        setIsHoveringComment(false);
        setIsDeleting(false);
      }
    };
    document.addEventListener("mousedown", HandleOutsideClickListener);
    return () => {
      document.removeEventListener("mousedown", HandleOutsideClickListener);
    };
  }, [settingsRef]);

  return (
    <>
      <div className="w-full h-fit pl-2 py-2 pr-1 flex gap-2 items-center bg-white rounded-lg sm:py-1">
        <img
          referrerPolicy="no-referrer"
          src={comment?.postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 border rounded-full cursor-pointer"
        />
        <div
          className="relative flex flex-row transition-all items-center justify-between w-full"
          onMouseOver={() => setIsHoveringComment(true)}
          onMouseOut={() => {
            if (!isSettingActive) setIsHoveringComment(false);
          }}
        >
          <div className="flex flex-col w-full h-fit items-start">
            <p className="font-bold text-sm cursor-pointer">
              {comment?.postedBy?.name}
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              {comment?.comment}
            </p>
          </div>
          {user?._id === comment?.postedBy?._id && isHoveringComment && (
            <BsThreeDotsVertical
              className="cursor-pointer transition-all py-1 px-2 hover:bg-gray-100 rounded-full"
              fontSize={30}
              onClick={() => setIsSettingActive(true)}
            />
          )}
          {isSettingActive && (
            <div
              className="absolute top-0 right-10 w-fit h-fit flex rounded-md cursor-pointer shadow-sm flex-col items-center justify-center border border-gray-400 overflow-hidden"
              ref={settingsRef}
            >
              <div
                className="group pt-2 pb-1 px-2 border-b border-gray-400 w-full h-fit flex items-center justify-center gap-1 transition-all hover:bg-gray-50"
                onClick={() => setIsDeleting(true)}
              >
                <MdDelete
                  fontSize={24}
                  className="group-hover:text-red-400 transition-all"
                />
                <p className="w-full block text-start text-sm">Delete</p>
              </div>
              <div className="group pt-2 pb-1 px-2 w-full h-fit flex items-center justify-center gap-1 transition-all hover:bg-gray-50">
                <AiTwotoneEdit
                  fontSize={24}
                  className="group-hover:text-blue-700 transition-all"
                />
                <p className="w-full block text-start text-sm">Edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isDeleting && (
        <div className="absolute z-50 top-0 left-0 flex flex-col px-2 items-center justify-center w-screen h-screen bg-gray-600/75">
          <div
            ref={settingsRef}
            className="border bg-white min-w-fit min-h-fit shadow-sm divide-y p-5 rounded-md"
          >
            <h3 className="pb-2 text-xl font-medium">
              Are you sure you want to delete this comment?
            </h3>
            <p className="py-3 text-base text-gray-700 font-medium">
              Once you delete this comment, you can no longer view, edit or
              recover it.
            </p>
            <div className="w-full flex items-center justify-between pt-3">
              <button
                onClick={() => {
                  setIsDeleting(false);
                  setIsSettingActive(false);
                  setIsHoveringComment(false);
                }}
                className="px-3 py-2 bg-white rounded-md transition-all outline outline-offset-0 outline-white active:outline-blue-700 hover:outline-blue-700 hover:outline-offset-2 focus:outline-blue-700"
              >
                No, Keep it
              </button>
              <button
                onClick={async () => {
                  if (comment && !isConfDeleting) {
                    setIsConfDeleting(true);
                    await delComment(comment._id);
                    setIsConfDeleting(false);
                    setIsHoveringComment(false);
                    setIsDeleting(false);
                    setIsSettingActive(false);
                  }
                }}
                className={
                  "px-3 py-2 bg-red-500 rounded-md transition-all text-white outline  outline-offset-0 outline-white active:outline-orange-red-500 hover:outline-orange-500 hover:outline-offset-2 focus:outline-orange-red-500"
                }
              >
                {isConfDeleting ? <Loader /> : "Delete it now!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CommentsList;
