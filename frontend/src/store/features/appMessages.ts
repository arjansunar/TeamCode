import { createSlice } from "@reduxjs/toolkit";
export type Message = { id: number; message: string; time: string };
type GlobalMessages = Record<string, Message[]>;
const initialState = {
  allMessages: {} as GlobalMessages,
};

export const appMessagesSlice = createSlice({
  name: "app/messages",
  initialState,
  reducers: {
    addMessageOf: (state, action) => {
      const of = action.payload.of;

      if (!state.allMessages[of]) state.allMessages[of] = [];
      state.allMessages[of].push(action.payload.messages);
    },
  },
});

export const { addMessageOf } = appMessagesSlice.actions;
export const appMessagesReducer = appMessagesSlice.reducer;

export const getMessagesOf = (
  state: { allMessages: { allMessages: GlobalMessages } },
  id: string
) => state.allMessages.allMessages[id];
