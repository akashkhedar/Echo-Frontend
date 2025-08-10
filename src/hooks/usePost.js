// hooks/useUserPosts.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const usePost = (userId) =>
  useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/post/fetch`);
      return res.data; // should be an array of posts
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
