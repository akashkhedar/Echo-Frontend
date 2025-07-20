import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // localStorage
import storageSession from "redux-persist/lib/storage/session";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import AuthSlice from "./slices/AuthSlice/AuthSlice";
import ChatSlice from "./slices/ChatSlice/ChatSlice";
import ConversationSlice from "./slices/ConversationSlice/ConversationSlice";

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
};

const chatPersistConfig = {
  key: "chat",
  version: 1,
  storage: storageSession,
};

const rootReducer = combineReducers({
  user: persistReducer(authPersistConfig, AuthSlice),
  chat: persistReducer(chatPersistConfig, ChatSlice),
  convo: persistReducer(chatPersistConfig, ConversationSlice),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
