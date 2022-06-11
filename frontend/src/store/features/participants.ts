import { createSlice } from "@reduxjs/toolkit";
import { DataConnection } from "peerjs";

export interface Participant {
  id: number;
  username: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: string;
  peerId: string;
  hashedRt: string;
  meetingId: null | string;
  myDataConnection?: DataConnection | null;
  otherDataConnection?: DataConnection | null;
}
const initialState = {
  participants: [] as Participant[],
};

export const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    // adds the total participants
    addParticipants: (state, action) => {
      const participants: Participant[] = action.payload;
      state.participants = participants;
    },
  },
});

export const { addParticipants } = participantsSlice.actions;
export const participantsReducer = participantsSlice.reducer;

// selectors
export const getParticipants = (state: { participants: typeof initialState }) =>
  state.participants.participants;
