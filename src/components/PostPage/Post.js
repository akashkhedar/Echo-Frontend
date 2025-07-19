import Box from "@mui/material/Box";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import PostCard from "./PostCard";
import PostLoading from "./PostLoading";
import NoPostsBox from "./NoPostsBox";

const Post = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const getPost = async () => {
      try {
        const userPosts = await axiosInstance.get("/post/feed"); // Fetch posts
        console.log(userPosts);
        setPosts(userPosts.data.data);
      } catch (error) {
        navigate("/signup");
      }
    };
    getPost();

    // eslint-disable-next-line
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
      {Array.isArray(posts) ? (
        posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <NoPostsBox />
        )
      ) : (
        <PostLoading />
      )}
    </Box>
  );
};

export default Post;
