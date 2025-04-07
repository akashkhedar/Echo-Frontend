import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
    chatId: null,
    roomId: null,
    chatUserId: null,
    chatName: null,
    chatUserName: null,
    chatProfileImage: null,
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
    setChatName: (state, action) => {
      state.chatName = action.payload;
    },
    setChatUserName: (state, action) => {
      state.chatUserName = action.payload;
    },
    setChatProfileImage: (state, action) => {
      state.chatProfileImage = action.payload;
    },
    clearChat: (state, action) => {
      state.chat = [];
      state.chatId = null;
      state.chatName = null;
      state.chatUserName = null;
      state.chatProfileImage = null;
    },
  },
});

export const {
  setChat,
  setChatId,
  setRoomId,
  setChatUserId,
  setChatName,
  setChatUserName,
  setChatProfileImage,
  clearChat,
  markMessageRead,
} = ChatSlice.actions;
export default ChatSlice.reducer;
