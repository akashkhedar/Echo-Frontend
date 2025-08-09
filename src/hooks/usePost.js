import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const usePost = (userId) =>
  useInfiniteQuery({
    queryKey: ["posts", userId], // Consistent key
    queryFn: async ({ pageParam = null }) => {
      const res = await axiosInstance.get("/post/fetch", {
        params: { cursor: pageParam },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      // Ensure cursor is properly formatted
      return lastPage.nextCursor
        ? new Date(lastPage.nextCursor).toISOString()
        : undefined;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export default usePost;
