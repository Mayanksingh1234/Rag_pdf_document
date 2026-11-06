import {createSlice} from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialstate:{
        name:"",
        email:"",
        isloggedin:false
    },
    reducers:{
        login:(state,action)=>{
            state.name=action.payload.name
            state.email=action.payload.email
            state.isloggedin=true
        },
        logout:(state)=>{
            state.name=""
            state.email=""
            state.isloggedin=false
        }
    }
})
export const {login,logout}=userSlice.actions
export default userSlice.reducer