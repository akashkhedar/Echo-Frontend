import { createSelector } from "reselect";

const selectConversations = (state) => state.convo;

export const selectHasUnreadMessages = createSelector(
  [selectConversations],
  (conversations) => conversations.some((convo) => convo.unread === true)
);
