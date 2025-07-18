import { configureStore } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";
import AuthSlice from "./slices/AuthSlice/AuthSlice";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import ChatSlice from "./slices/ChatSlice/ChatSlice";
import ConversationSlice from "./slices/ConversationSlice/ConversationSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession,
};

const reducer = combineReducers({
  user: AuthSlice,
  chat: ChatSlice,
  convo: ConversationSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});
