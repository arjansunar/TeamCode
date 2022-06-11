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

    setMyDataConnection: (
      state,
      action: {
        payload: { participantId: number; connection: DataConnection };
        type: string;
      }
    ) => {
      const { participantId, connection } = action.payload;
      const getParticipantId = state.participants.findIndex(
        (el) => el.id === participantId
      );
      if (getParticipantId < 0) return;
      state.participants[getParticipantId].myDataConnection = connection;

      state.participants = [...state.participants];
    },

    setOtherDataConnection: (
      state,
      action: {
        payload: { participantId: number; connection: DataConnection };
        type: string;
      }
    ) => {
      const { participantId, connection } = action.payload;
      const getParticipantId = state.participants.findIndex(
        (el) => el.id === participantId
      );
      if (getParticipantId < 0) return;
      state.participants[getParticipantId].otherDataConnection = connection;
      state.participants = [...state.participants];
    },
  },
});

export const { addParticipants, setMyDataConnection, setOtherDataConnection } =
  participantsSlice.actions;
export const participantsReducer = participantsSlice.reducer;

// selectors
export const getParticipants = (state: { participants: typeof initialState }) =>
  state.participants.participants;

export const getMyConnection = (state: any, id: number) => {
  const participant: Participant = state.participants.participants.find(
    (el: Participant) => el.id === id
  );
  return participant?.myDataConnection;
};

export const getOtherConnection = (state: any, id: number) => {
  const participant: Participant = state.participants.participants.find(
    (el: Participant) => el.id === id
  );
  return participant?.otherDataConnection;
};
