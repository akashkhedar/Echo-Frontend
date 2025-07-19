import { useDispatch } from "react-redux";
import {
  setChatId,
  setChatUserId,
  setRoomId,
} from "../redux/slices/ChatSlice/ChatSlice";
import { markConversationRead } from "../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../utils/socket";

const useConversationSelection = () => {
  const dispatch = useDispatch();

  const selectConversation = async (convo, id) => {
    try {
      socket.emit("rmOfflineMsg", id, convo._id);
      dispatch(markConversationRead(convo._id));
      dispatch(setChatId(convo._id));
      dispatch(setRoomId(convo.roomId));
      dispatch(setChatUserId(convo.user._id));
    } catch (error) {
      console.log(error);
    }
  };

  return selectConversation;
};

export default useConversationSelection;
