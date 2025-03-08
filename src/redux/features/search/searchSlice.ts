import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchTerm: string;
  userId: string;
}

const initialState: SearchState = {
  searchTerm: "",
  userId: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setSearchTerm, setUserId } = searchSlice.actions;
export default searchSlice.reducer;
