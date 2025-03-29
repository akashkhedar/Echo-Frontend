import { createSlice } from "@reduxjs/toolkit";

const ConversationSlice = createSlice({
  name: "conversations",
  initialState: [],
  reducers: {
    setConversations: (state, action) => {
      return action.payload;
    },
  },
});

export const { setConversations } = ConversationSlice.actions;
export default ConversationSlice.reducer;
