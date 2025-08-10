import { useQueryClient } from "@tanstack/react-query";

const SELECTED_CONVERSATION_KEY = ["selectedConversation"];

const useSelectedChatUser = () => {
  const queryClient = useQueryClient();

  const saveConversation = (conversation) => {
    queryClient.setQueryData(SELECTED_CONVERSATION_KEY, conversation);
  };

  const clearConversation = () => {
    queryClient.setQueryData(SELECTED_CONVERSATION_KEY, null);
  };

  const conversation =
    queryClient.getQueryData(SELECTED_CONVERSATION_KEY) || null;

  return {
    saveConversation,
    clearConversation,
    conversation,
    isSelected: !!conversation,
  };
};

export default useSelectedChatUser;
