import { useDispatch } from "react-redux";
import { markConversationRead } from "../redux/slices/ConversationSlice/ConversationSlice";
import {
  setChat,
  setRoomId,
  setChatId,
  setChatUserId,
} from "../redux/slices/ChatSlice/ChatSlice";
import socket from "../utils/socket";
import axiosInstance from "../axiosInstance";

const useConversationSelection = () => {
  const dispatch = useDispatch();

  const selectConversation = async (convo, id) => {
    try {
      socket.emit("rmOfflineMsg", id, convo._id);
      dispatch(markConversationRead(convo._id));
      dispatch(setChatId(convo._id));
      dispatch(setRoomId(convo.roomId));
      dispatch(setChatUserId(convo.user._id));
      const res = await axiosInstance(`/fetch/chats/${convo._id}`);
      dispatch(setChat(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  return selectConversation;
};

export default useConversationSelection;
