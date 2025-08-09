import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const fetchMessages = async ({ pageParam = 0, chatId }) => {
  const res = await axiosInstance.get(
    `/chat/fetch/msg/${chatId}?skip=${pageParam}&limit=30`
  );
  return res.data;
};

const useChatMessages = (chatId) => {
  return useInfiniteQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: ({ pageParam = 0 }) => fetchMessages({ pageParam, chatId }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 30
        ? undefined
        : allPages.reduce((acc, page) => acc + page.length, 0),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // Cache for 1 min to prevent refetch spam
  });
};

export default useChatMessages;
