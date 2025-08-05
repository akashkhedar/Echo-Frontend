import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import usePost from "../../hooks/usePost";
import PostCard from "../PostPage/PostCard";
import PostLoading from "../PostPage/PostLoading";

const PostMade = () => {
  const userId = useSelector((state) => state.user._id);
  const { data: posts, isLoading } = usePost(userId);

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
      {!isLoading ? (
        posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} setPosts={posts} />
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
