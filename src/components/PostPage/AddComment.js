import React, { useState } from "react";
import { Avatar, Box, Button, TextField } from "@mui/material";

const AddComment = () => {
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
        src="https://via.placeholder.com/40"
        alt="User Avatar"
        sx={{ width: 40, height: 40 }}
      />
      {/* Comment Input */}
      <TextField
        // value={commentText}
        // onChange={(e) => setCommentText(e.target.value)}
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
        // onClick={handleSubmit}
        variant="contained"
        size="medium"
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
