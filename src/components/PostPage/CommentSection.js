import { Box, CardActions, CardContent, Divider } from "@mui/material";
import React from "react";
import Comment from "./Comment";
import AddComment from "./AddComment";

const comments = [
  {
    id: 1,
    username: "john_doe",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "This is such an amazing post! Loved it. 😊",
    likes: 15,
  },
  {
    id: 2,
    username: "jane_smith",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Great insights shared here. Thanks for posting!",
    likes: 8,
  },
  {
    id: 3,
    username: "michael_b",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Wow! This totally resonates with me. Keep it up!",
    likes: 25,
  },
  {
    id: 4,
    username: "emily_rose",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Interesting perspective. I hadn’t thought of it this way!",
    likes: 12,
  },
  {
    id: 5,
    username: "alexander",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "This is exactly what I was looking for. Thank you!",
    likes: 5,
  },
  {
    id: 6,
    username: "john_doe",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "This is such an amazing post! Loved it. 😊",
    likes: 15,
  },
  {
    id: 7,
    username: "jane_smith",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Great insights shared here. Thanks for posting!",
    likes: 8,
  },
  {
    id: 8,
    username: "michael_b",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Wow! This totally resonates with me. Keep it up!",
    likes: 25,
  },
  {
    id: 9,
    username: "emily_rose",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "Interesting perspective. I hadn’t thought of it this way!",
    likes: 12,
  },
  {
    id: 10,
    username: "alexander",
    userProfilePhoto: "https://via.placeholder.com/40",
    commentText: "This is exactly what I was looking for. Thank you!",
    likes: 5,
  },
];

const CommentSection = () => {
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
        }}
        textAlign="left"
      >
        Comments
      </Divider>
      <Box sx={{ position: "sticky", zIndex: 1, top: 0 }}>
        <AddComment />
      </Box>
      <Box mt={1}>
        {comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;
