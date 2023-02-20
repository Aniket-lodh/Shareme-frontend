import { useState, useEffect, useRef } from "react";
import CommentsList from "../components/commentsList";
import { BiSend } from "react-icons/bi";
import Spinner, { Loader } from "../components/Spinner.jsx";
import { client } from "../utils/client.js";
import { getCommentsQuery } from "../utils/data";

export const Comments = ({ pinId, user }) => {
  const commentRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [addingComment, setAddingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const getComments = async () => {
    const query = getCommentsQuery(pinId);
    client.fetch(query).then((data) => {
      setComments(data);
    });
  };
  useEffect(() => {
    getComments();
  }, [pinId]);

  const addComment = async () => {
    if (
      commentRef.current.value !== undefined &&
      commentRef.current.value !== "" &&
      commentRef.current.value !== null &&
      !addingComment
    ) {
      setAddingComment(true);
      await client
        .create({
          _type: "comments",
          pinId: {
            _type: "reference",
            _ref: pinId,
          },
          postedBy: {
            _type: "reference",
            _ref: user?._id,
          },
          comment: commentRef.current.value,
        })
        .then(() => {
          commentRef.current.value = null;
          setIsLoadingComments(true);
          //Fetching the comments again after adding a new one
          getComments().then(() => {
            setAddingComment(false);
            setIsLoadingComments(false);
          });
        });
    }
  };
  const delComment = async (comId) => {
    await client
      .delete(comId)
      .then((data) => {
        if(data)
          getComments();
      })
      .catch((err) => {
        alert("Error in Deleting Comment");
        console.log(err);
      });
  };

  return (
    <div className="bg-gray-100 mt-3 px-2 pb-3 rounded-xl rounded-b-5xl flex flex-col items-start justify-between h-fit w-full">
      <details className="w-full">
        <summary className="mt-5 text-2xl mb-2 cursor-pointer ">
          {comments ? comments?.length : "0"} Comments
        </summary>
        <div className="max-h-370 w-full overflow-y-auto scrollbar-hidden px-3 pb-4">
          {isLoadingComments && <Spinner message={"loading comments..."} />}

          {!isLoadingComments &&
            comments &&
            comments?.map((comment, index) => (
              <div key={index} className="w-full">
                <CommentsList
                  comment={comment}
                  user={user}
                  delComment={delComment}
                />
              </div>
            ))}
          {!isLoadingComments && !comments && (
            <div className="flex w-full items-center justify-center mt-6">
              <p className="text-xl font-medium">No Comments</p>
            </div>
          )}
        </div>
      </details>

      <div className="sticky bg-white -bottom-2 rounded-full px-4 py-3 flex items-center justify-center w-full drop-shadow-md">
        <input
          type="text"
          className="w-3/5 flex flex-auto border-gray-100 outline-none border-2 p-2 rounded-l-2xl focus:border-gray-300"
          placeholder="Add a comment"
          ref={commentRef}
          onKeyDown={(e) => {
            if (e.code === "Enter" || e.code === "NumpadEnter") {
              addComment();
            }
          }}
        />
        <button
          type="button"
          className="w-1/5 md:w-auto flex items-center justify-center flex-initial bg-red-500 text-white rounded-r-full px-3 py-2 font-semibold text-base outline outline-red-500"
          onClick={addComment}
        >
          {addingComment ? <Loader /> : <BiSend fontSize={24} />}
        </button>
      </div>
    </div>
  );
};
