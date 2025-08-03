// hooks/useConversationSelection.js
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../axiosInstance";
import {
  setChatId,
  setRoomId,
  setChatUserId,
} from "../redux/slices/ChatSlice/ChatSlice";
import socket from "../utils/socket";

const useConversationSelection = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const selectConversation = async (convo, id) => {
    try {
      socket.emit("rmOfflineMsg", id, convo._id);

      // Update conversation unread flag
      queryClient.setQueryData(["conversations", id], (prev) =>
        prev?.map((c) => (c._id === convo._id ? { ...c, unread: false } : c))
      );

      dispatch(setChatId(convo._id));
      dispatch(setRoomId(convo.roomId));
      dispatch(setChatUserId(convo.user._id));

      // Prefetch first page of messages
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["chatMessages", convo._id],
        queryFn: ({ pageParam = 0 }) =>
          axiosInstance
            .get(`/chat/fetch/msg/${convo._id}?skip=${pageParam}&limit=30`)
            .then((res) => res.data),
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length < 30 ? undefined : allPages.flat().length,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return selectConversation;
};

export default useConversationSelection;
