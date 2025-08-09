// hooks/useFeedPosts.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const fetchFeedPosts = async ({ pageParam = 1 }) => {
  const { data } = await axiosInstance.get(
    `/post/feed?page=${pageParam}&limit=10`
  );
  return data;
};

export const useFeedPosts = (userId) => {
  return useInfiniteQuery({
    queryKey: ["feedPosts", userId],
    queryFn: fetchFeedPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1; // next page number
      }
      return undefined; // no more pages
    },
    refetchOnWindowFocus: false,
  });
};
