import React, { useState } from "react";
import { Avatar, Box, Button, TextField } from "@mui/material";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";

const AddComment = ({ postId, setComments, setCommentCount }) => {
  const userProfile = useSelector((state) => state.user.profileImage);
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
        borderRadius: "8px",
        background: "rgb(21, 21, 43)",
        paddingY: 1.5,
      }}
    >
      {/* Profile Image */}
      <Avatar
        src={userProfile}
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
            borderRadius: "16px",
            background: "#323232",
            color: "whitesmoke",
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
        }}
      >
        Post
      </Button>
    </Box>
  );
};

export default AddComment;
