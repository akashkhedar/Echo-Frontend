import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
    chatId: null,
    roomId: null,
    chatUserId: null,
  },
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    markMessageRead: (state, action) => {
      const messageId = action.payload;
      state.chat = state.chat.map((msg) =>
        msg._id === messageId ? { ...msg, read: true } : msg
      );
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setChatUserId: (state, action) => {
      state.chatUserId = action.payload;
    },
    clearChat: (state, action) => {
      state.chat = [];
      state.chatId = null;
      state.chatUserId = null;
      state.roomId = null;
    },
  },
});

export const {
  setChat,
  setChatId,
  setRoomId,
  setChatUserId,
  clearChat,
  markMessageRead,
} = ChatSlice.actions;
export default ChatSlice.reducer;
