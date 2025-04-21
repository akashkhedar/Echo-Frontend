import { createSlice } from "@reduxjs/toolkit";

const ConversationSlice = createSlice({
  name: "conversations",
  initialState: [],
  reducers: {
    setConversations: (state, action) => {
      return action.payload.map((convo) => ({
        ...convo,
      }));
    },
    markConversationUnread: (state, action) => {
      const convo = state.find((c) => c._id === action.payload);
      if (convo) {
        convo.unread = true;
      }
    },
    markConversationRead: (state, action) => {
      const convo = state.find((c) => c._id === action.payload);
      if (convo) {
        convo.unread = false;
      }
    },
    setUserOnline: (state, action) => {
      state.forEach((convo) => {
        if (convo.user._id === action.payload) {
          convo.user.isOnline = true;
        }
      });
    },
    setUserOffline: (state, action) => {
      state.forEach((convo) => {
        if (convo.user._id === action.payload) {
          convo.user.isOnline = false;
        }
      });
    },
  },
});

export const {
  setConversations,
  markConversationUnread,
  markConversationRead,
  setUserOnline,
  setUserOffline,
} = ConversationSlice.actions;
export default ConversationSlice.reducer;
