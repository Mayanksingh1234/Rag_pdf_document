import {configureStore} from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import themeReducer from './ThemeSlice';

const store=configureStore({
    reducers:{
        theme:themeReducer,
        user:userReducer
    }
})
