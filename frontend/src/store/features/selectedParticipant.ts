import { createSlice } from "@reduxjs/toolkit";
import { Participant } from "./participants";

const initialState = {
  selected: {} as Participant,
};

export const selectedParticipantSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelected(state, action: { payload: Participant; type: string }) {
      state.selected = action.payload;
    },
  },
});

export const { setSelected } = selectedParticipantSlice.actions;
export const selectedParticipantReducer = selectedParticipantSlice.reducer;

// selector
export const getSelectedParticipant = (state: {
  selectedParticipant: typeof initialState;
}) => state.selectedParticipant.selected;
