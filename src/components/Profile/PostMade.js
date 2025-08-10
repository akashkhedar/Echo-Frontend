import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { usePost } from "../../hooks/usePost";
import useUser from "../../hooks/useUser";
import socket from "../../utils/socket";
import PostCard from "../PostPage/PostCard";
import PostLoading from "../PostPage/PostLoading";

const PostMade = () => {
  const { data: user } = useUser();

  const queryClient = useQueryClient();
  const { data: posts, isLoading } = usePost(user._id);

  useEffect(() => {
    socket.on("newPostMade", (post) => {
      queryClient.setQueryData(["posts", user._id], (old) =>
        old ? [post, ...old] : [post]
      );
    });

    socket.on("postDeleted", (postId) => {
      queryClient.setQueryData(["posts", user._id], (old) =>
        old ? old.filter((p) => p._id !== postId) : []
      );
    });

    return () => {
      socket.off("newPostMade");
      socket.off("postDeleted");
    };
  }, [queryClient, user._id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        background: "#121212",
        marginTop: -0.6,
      }}
    >
      {isLoading ? (
        <PostLoading />
      ) : posts?.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
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
      )}
    </Box>
  );
};

export default PostMade;
