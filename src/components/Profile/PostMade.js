import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { Box, Typography } from "@mui/material";
import PostCard from "../PostPage/PostCard";
import PostLoading from "../PostPage/PostLoading";

const PostMade = () => {
  const [postMade, setPostMade] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post/fetch");
      setPostMade(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      {!loading ? (
        postMade && postMade.length > 0 ? (
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
              bgcolor: "#1e1e2f",
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" fontWeight={800} color="whitesmoke">
              No Posts Made!
            </Typography>
          </Box>
        )
      ) : (
        <PostLoading />
      )}
    </Box>
  );
};

export default PostMade;
