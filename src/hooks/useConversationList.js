// hooks/useConversations.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const useConversationList = (userId) =>
  useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat/list");
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export default useConversationList;
