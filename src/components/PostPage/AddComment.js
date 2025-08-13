import {
  Avatar,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import useUser from "../../hooks/useUser";

const AddComment = ({ postId, setComments, setCommentCount }) => {
  const { data: user } = useUser();

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/post/comment/${postId}`, {
        comment: comment,
      });
      if (res) {
        setComments((prev) => [res.data, ...prev]);
        setCommentCount((prev) => prev + 1);
        setComment(""); // Clear input after posting
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
        disabled={!comment.trim() || loading}
        sx={{
          textTransform: "none",
          borderRadius: "10px",
          backgroundColor: "#2000c1ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#0a0763ff",
          },
          "&.Mui-disabled": {
            backgroundColor: "#0a0763ff",
            color: "#fff",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          "Post"
        )}
      </Button>
    </Box>
  );
};

export default AddComment;
