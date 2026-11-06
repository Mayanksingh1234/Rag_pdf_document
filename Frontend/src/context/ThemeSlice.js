import {createSlice} from "@reduxjs/toolkit";
import { createElement } from "react";

const ThemeSlice=createSlice({
    name:"theme",
    initialState:{
        mode:"light"
    },
    reducers:{
        toggleTheme:(state)=>{
            state.mode=state.mode==="light"?"dark":"light"
        }
    }
})

export const {toggleTheme}=ThemeSlice.actions
export default ThemeSlice.reducer