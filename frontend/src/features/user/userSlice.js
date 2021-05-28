import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "user",
  initialState: {
    username: "",
  },
  reducers: {
    logIn: (state, action) => {
      state.username = action.payload;
    },
    logOut: (state) => {
      state.username = "";
    },
  },
});

export const { logIn, logOut } = slice.actions;

export const selectUsername = (state) => {
  return state.userReducer.username;
};

export default slice.reducer;
