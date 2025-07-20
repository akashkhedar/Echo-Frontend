import { createSelector } from "@reduxjs/toolkit";

export const selectConversationState = (state) => state.convo;

export const selectConversations = createSelector(
  [selectConversationState],
  (convo) => convo.items || [] // fallback for safety
);

export const selectHasUnreadMessages = createSelector(
  [selectConversations],
  (conversations) =>
    Array.isArray(conversations) &&
    conversations.some((convo) => convo.unread === true)
);

export const selectConversationMeta = createSelector(
  [selectConversationState],
  (convo) => ({
    items: convo.items || [],
    loading: convo.loading,
    error: convo.error,
  })
);
