import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: null as null | number,
};

export const selectedParticipantSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelected(state, action: { payload: number; type: string }) {
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
