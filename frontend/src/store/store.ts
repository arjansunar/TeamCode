import { configureStore } from "@reduxjs/toolkit";
import { appMessagesReducer } from "./features/appMessages";
import {
  participantsReducer,
  setMyDataConnection,
} from "./features/participants";
import { selectedParticipantReducer } from "./features/selectedParticipant";

export const store = configureStore({
  reducer: {
    allMessages: appMessagesReducer,
    participants: participantsReducer,
    selectedParticipant: selectedParticipantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["participants/setMyDataConnection"],
      },
    }),
});
