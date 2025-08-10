// hooks/useFeedPosts.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const useFeedPosts = (userId) =>
  useQuery({
    queryKey: ["feedPosts", userId],
    queryFn: async () => {
      const res = await axiosInstance.get("/post/feed"); // fetch all feed posts
      return res.data; // should be an array of posts
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
