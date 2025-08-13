// components/PostPage/Post.js
import Box from "@mui/material/Box";
import { useMediaQuery, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFeedPosts } from "../../hooks/useFeedPosts";
import useUser from "../../hooks/useUser";
import socket from "../../utils/socket";
import NoPostsBox from "./NoPostsBox";
import PostCard from "./PostCard";
import PostLoading from "./PostLoading";

const Post = () => {
  const { data: user } = useUser();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useFeedPosts(user._id);

  // Socket updates
  useEffect(() => {
    socket.on("getNewPost", (post) => {
      queryClient.setQueryData(["feedPosts", user._id], (old) =>
        old ? [post, ...old] : [post]
      );
    });

    socket.on("postDeleted", (postId) => {
      queryClient.setQueryData(["feedPosts", user._id], (old) =>
        old ? old.filter((p) => p._id !== postId) : []
      );
    });

    return () => {
      socket.off("getNewPost");
      socket.off("postDeleted");
    };
  }, [queryClient, user._id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: -0.9,
        px: { sm: "0.5rem", md: "1.5rem" },
        height: isMobile ? "calc(100vh - 56px - 4rem)" : "100%",
      }}
    >
      {isLoading ? (
        <PostLoading />
      ) : posts?.length > 0 ? (
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
