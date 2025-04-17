import { createSlice } from "@reduxjs/toolkit";

const ConversationSlice = createSlice({
  name: "conversations",
  initialState: [],
  reducers: {
    setConversations: (state, action) => {
      return action.payload.map((convo) => ({
        ...convo,
        unread: false, // initialize unread to false
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
  },
});

export const {
  setConversations,
  markConversationUnread,
  markConversationRead,
} = ConversationSlice.actions;
export default ConversationSlice.reducer;
