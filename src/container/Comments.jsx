import { useState, useEffect, useRef } from "react";
import CommentsList from "../components/commentsList";
import { BiSend } from "react-icons/bi";
import Spinner from "../components/Spinner.jsx";
import { client } from "../utils/client.js";
import { getCommentsQuery } from "../utils/data";
import { TbLoader2 } from "react-icons/tb";

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
        if (data) getComments();
      })
      .catch((err) => {
        alert("Error in Deleting Comment");
        console.log(err);
      });
  };

  return (
    <div className="flex items-start justify-between flex-col gap-2 h-full max-h-full w-full overflow-hidden">
      <div className="pt-0.5 h-10/12 overflow-y-auto scroll-smooth self-stretch">
        {/* Comments Header */}
        <h4 className="text-lg mb-2 font-semibold">
          {comments?.length || 0} Comments
        </h4>

        {/* Comments List */}
        <div className="min-h-0">
          {isLoadingComments ? (
            <Spinner message="Loading comments..." />
          ) : comments?.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="mb-4">
                <CommentsList
                  comment={comment}
                  user={user}
                  delComment={delComment}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Comment Input */}
      <div className="flex items-center gap-1 md:gap-3 self-stretch mb-1 md:mb-0">
        <img
          src={user?.image}
          alt={user?.name}
          className="w-8 h-8 rounded-full"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 flex items-center gap-1 md:gap-2">
          <input
            type="text"
            className="flex-1 text-xs px-2 md:px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            ref={commentRef}
            onKeyDown={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                addComment();
              }
            }}
          />
          <button
            type="button"
            className="p-1.5 md:p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addComment}
            disabled={addingComment}
          >
            {addingComment ? (
              <TbLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <BiSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
