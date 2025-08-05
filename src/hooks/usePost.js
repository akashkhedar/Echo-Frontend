// hooks/useConversations.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const useConversationList = (userId) =>
  useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const res = await axiosInstance.get("/post/fetch");
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export default useConversationList;
