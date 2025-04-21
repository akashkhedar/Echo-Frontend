import { createSelector } from "@reduxjs/toolkit";

export const selectChatUser = createSelector(
  [(state) => state.convo, (state) => state.chat.chatUserId],
  (conversations, userId) => {
    const convo = conversations.find((c) => c.user._id === userId);
    return convo ? convo.user : null;
  }
);
