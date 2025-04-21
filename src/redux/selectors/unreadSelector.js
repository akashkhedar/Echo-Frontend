import { createSelector } from "reselect";

const selectConversations = (state) => state.convo;

export const selectHasUnreadMessages = createSelector(
  [selectConversations],
  (conversations) => conversations.some((c) => c.unread === true)
);
