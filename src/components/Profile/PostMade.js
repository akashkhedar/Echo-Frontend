import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import usePost from "../../hooks/usePost";
import socket from "../../utils/socket";
import PostCard from "../PostPage/PostCard";
import PostLoading from "../PostPage/PostLoading";

const PostMade = () => {
  const userId = useSelector((state) => state.user.userId);
  const queryClient = useQueryClient();
  const containerRef = useRef(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePost(userId);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // Listen for new posts via socket
  useEffect(() => {
    socket.on("newPostMade", (post) => {
      queryClient.setQueryData(["posts", userId], (old) => {
        if (!old)
          return {
            pages: [{ posts: [post], nextCursor: null }],
            pageParams: [null],
          };

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              posts: [post, ...old.pages[0].posts],
            },
            ...old.pages.slice(1),
          ],
        };
      });
    });

    return () => {
      socket.off("getNewPost");
    };
  }, [queryClient, userId]);

  // Infinite scroll
  // In PostMade component
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // More conservative threshold (20% of viewport height from bottom)
      if (scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetchNextPage();
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box
      ref={containerRef}
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
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard post={post} />
          ))}
          {isFetchingNextPage && <PostLoading />}
        </>
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
