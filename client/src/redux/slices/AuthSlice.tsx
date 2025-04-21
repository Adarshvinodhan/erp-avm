import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');

        }
    }
})

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;