import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import socket from "../utils/socket";

const useConversationSelection = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const selectConversation = async (convo, id) => {
    try {
      socket.emit("rmOfflineMsg", id, convo._id);

      queryClient.setQueryData(["conversations", id], (prev) =>
        prev?.map((c) => (c._id === convo._id ? { ...c, unread: false } : c))
      );

      await queryClient.prefetchQuery({
        queryKey: ["messages", convo._id],
        queryFn: () =>
          axiosInstance
            .get(`/chat/fetch/msg/${convo._id}`)
            .then((res) => res.data),
        staleTime: 1000 * 60,
      });

      navigate("/chat");
    } catch (error) {
      console.error("Error selecting conversation:", error);
    }
  };

  return selectConversation;
};

export default useConversationSelection;
