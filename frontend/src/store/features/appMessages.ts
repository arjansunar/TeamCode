import { createSlice } from "@reduxjs/toolkit";

interface GlobalMessages {
  from_id: string[];
}
const initialState = {
  allMessages: {} as GlobalMessages,
};

export const appMessagesSlice = createSlice({
  name: "app/messages",
  initialState,
  reducers: {
    addMessageFrom: (state, action) => {
      const from_id = action.payload.from;
      state.allMessages.from_id = action.payload.messages;
    },
  },
});

export const { addMessageFrom } = appMessagesSlice.actions;
export const appMessagesReducer = appMessagesSlice.reducer;
