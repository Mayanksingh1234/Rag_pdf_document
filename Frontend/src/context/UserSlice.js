import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    id: "",
    name: "",
    email: "",
    isloggedin: false,
  },

  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isloggedin = true;
    },

    logout: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.isloggedin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;