import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const SELECTED_CONVERSATION_KEY = ["selectedConversation"];

const useSelectedChatUser = () => {
  const queryClient = useQueryClient();
  const [conversation, setConversation] = useState(() => {
    // Initialize with current cache value
    return queryClient.getQueryData(SELECTED_CONVERSATION_KEY) || null;
  });

  const saveConversation = (conversation) => {
    // Update both state and cache
    queryClient.setQueryData(SELECTED_CONVERSATION_KEY, conversation);
    setConversation(conversation);
  };

  const clearConversation = () => {
    // Clear both state and cache
    queryClient.setQueryData(SELECTED_CONVERSATION_KEY, null);
    setConversation(null);
  };

  // Sync with cache changes from other places
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey === SELECTED_CONVERSATION_KEY) {
        setConversation(event.query.state.data);
      }
    });
    return unsubscribe;
  }, [queryClient]);

  return {
    saveConversation,
    clearConversation,
    conversation,
    isSelected: !!conversation,
  };
};

export default useSelectedChatUser;
