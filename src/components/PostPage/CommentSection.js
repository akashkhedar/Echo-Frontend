import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import AddComment from "./AddComment";
import Comment from "./Comment";
import LoadingComments from "./LoadingComments";
import NoComments from "./NoComments";

const CommentSection = ({ postId, setCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async (postId) => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/post/fetch/comments/${postId}`);
        if (res.data) {
          setComments(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments(postId);
  }, [postId]);
  return (
    <Box
      sx={{
        borderRadius: "8px",
        width: "100%",
        background: "#11111b",
        maxHeight: "25rem",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Divider
        sx={{
          width: "100%",
          paddingY: "0.8rem",
          position: "sticky",
          zIndex: 1,
          top: 0,
          background: "#11111b",
          "&::before, &::after": {
            borderColor: "whitesmoke",
            marginX: 1,
          },
          color: "#d900ffff",
        }}
        textAlign="left"
      >
        Comments
      </Divider>
      <Box sx={{ position: "sticky", zIndex: 1, top: 0 }}>
        <AddComment
          postId={postId}
          setComments={setComments}
          setCommentCount={setCommentCount}
        />
      </Box>
      <Box mt={1}>
        {loading ? (
          <LoadingComments />
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => <Comment comment={comment} />)
        ) : (
          <NoComments />
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
