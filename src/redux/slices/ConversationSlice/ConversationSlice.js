import { createSlice } from "@reduxjs/toolkit";

const ConversationSlice = createSlice({
  name: "conversations",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setConversations: (state, action) => {
      state.items = action.payload;
    },
    markConversationUnread: (state, action) => {
      const convo = state.items.find((c) => c._id === action.payload);
      if (convo) {
        convo.unread = true;
      }
    },
    markConversationRead: (state, action) => {
      const convo = state.items.find((c) => c._id === action.payload);
      if (convo) {
        convo.unread = false;
      }
    },
    setUserOnline: (state, action) => {
      state.items.forEach((convo) => {
        if (convo.user._id === action.payload) {
          convo.user.isOnline = true;
        }
      });
    },
    setUserOffline: (state, action) => {
      state.items.forEach((convo) => {
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
