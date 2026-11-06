import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./ThemeSlice";
import userReducer from "./UserSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
  },
});