import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

const useSelectedChatUser = () => {
  const userId = useSelector((state) => state.chat.chatUserId);
  const authUser = useSelector((state) => state.user.userId);
  const queryClient = useQueryClient();

  const conversations = queryClient.getQueryData(["conversations", authUser]);

  if (!conversations || !userId) return null;

  const convo = conversations.find((c) => c.user._id === userId);
  return convo ? convo.user : null;
};

export default useSelectedChatUser;
