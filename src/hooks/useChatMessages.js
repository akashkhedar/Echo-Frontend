import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const fetchAllMessages = async (chatId) => {
  const res = await axiosInstance.get(`/chat/fetch/msg/${chatId}`);
  return res.data;
};

const useChatMessages = (chatId) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => fetchAllMessages(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
};

export default useChatMessages;
