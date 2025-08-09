import Box from "@mui/material/Box";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useFeedPosts } from "../../hooks/useFeedPosts";
import socket from "../../utils/socket";
import NoPostsBox from "./NoPostsBox";
import PostCard from "./PostCard";
import PostLoading from "./PostLoading";
import { useSelector } from "react-redux";

const Post = () => {
  const { userId } = useSelector((state) => state.user);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeedPosts(userId);
  const observerRef = useRef();
  const queryClient = useQueryClient();

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Socket real-time post update
  useEffect(() => {
    socket.on("getNewPost", (post) => {
      queryClient.setQueryData(["feedPosts", userId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page, idx) => {
            if (idx === 0) {
              return { ...page, data: [post, ...page.data] };
            }
            return page;
          }),
        };
      });
    });
    socket.on("postDeleted", (postId) => {
      console.log("postDeleted", postId);
      queryClient.setQueryData(["feedPosts", userId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: Array.isArray(page.data)
              ? page.data.filter((p) => p._id !== postId)
              : [],
          })),
        };
      });
    });

    return () => {
      socket.off("getNewPost");
      socket.off("postDeleted");
    };
  }, [queryClient, userId]);

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

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
      {isLoading ? (
        <PostLoading />
      ) : allPosts.length > 0 ? (
        <>
          {allPosts.map((post) => (
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
          ))}
          <div ref={observerRef} style={{ height: 1 }} />
          {isFetchingNextPage && <PostLoading />}
        </>
      ) : (
        <NoPostsBox />
      )}
    </Box>
  );
};

export default Post;
