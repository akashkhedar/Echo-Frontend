import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
    chatId: null,
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
  setChatUserId,
  setChatName,
  setChatUserName,
  setChatProfileImage,
  clearChat,
} = ChatSlice.actions;
export default ChatSlice.reducer;
