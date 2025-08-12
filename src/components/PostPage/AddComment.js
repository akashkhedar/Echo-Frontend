import { Avatar, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import useUser from "../../hooks/useUser";

const AddComment = ({ postId, setComments, setCommentCount }) => {
  const { data: user } = useUser();

  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post(`/post/comment/${postId}`, {
        comment: comment,
      });
      if (res) {
        setComments((prev) => [res.data, ...prev]);
        setCommentCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1,

        paddingY: 1.5,
      }}
    >
      {/* Profile Image */}
      <Avatar
        src={user.profileImage}
        alt="User Avatar"
        sx={{ width: 40, height: 40 }}
      />
      {/* Comment Input */}
      <TextField
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        variant="outlined"
        size="small"
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
            backgroundColor: "#0f0f17ff",
            color: "white",
            height: "2.5rem",
            paddingLeft: 1,
            border: "1px solid #3c3b3bff",
            transition: "border 0.2s ease",
            "&:hover": {
              borderColor: "#d900ff92",
            },
          },
          input: {
            color: "white",
            padding: "0 10px",
          },
        }}
      />
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        size="medium"
        disabled={!comment.trim()}
        sx={{
          textTransform: "none",
          borderRadius: "10px",
          backgroundColor: "#2000c1ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#0a0763ff",
          },
          "&.Mui-disabled": {
            backgroundColor: "#0a0763ff", // darker blue when loading
            color: "#fff",
          },

          background: "#070022ff",
        }}
      >
        Post
      </Button>
    </Box>
  );
};

export default AddComment;
