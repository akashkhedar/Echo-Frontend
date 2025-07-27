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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getPost = async () => {
      try {
        const userPosts = await axiosInstance.get("/post/feed");
        setPosts(userPosts.data.data);
      } catch (error) {
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",

        background: "#121212",
        mt: -0.6,
        px: { sm: "0.5rem", md: "1.5rem" },
        height: "100%",
      }}
    >
      {loading ? (
        <PostLoading />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Box
            key={post._id}
            sx={{
              width: "100%",
              mb: "1.5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PostCard post={post} />
          </Box>
        ))
      ) : (
        <NoPostsBox />
      )}
    </Box>
  );
};

export default Post;
