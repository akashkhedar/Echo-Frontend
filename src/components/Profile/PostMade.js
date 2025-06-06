import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { Box, Typography } from "@mui/material";
import PostCard from "../PostPage/PostCard";

const PostMade = () => {
  const [postMade, setPostMade] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/fetch/posts");
      setPostMade(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        background: "#121212",
        marginTop: -0.6,
      }}
    >
      {postMade && postMade.length > 0 ? (
        postMade.map((post) => (
          <PostCard key={post._id} post={post} setPosts={setPostMade} />
        ))
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "10rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={800} color="whitesmoke">
            No Posts Made!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostMade;
