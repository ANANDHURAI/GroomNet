import { createSlice } from "@reduxjs/toolkit";

const storedUserData = localStorage.getItem('user');
const initialState = storedUserData ? JSON.parse(storedUserData) : {
    name: '',
    islogged: false,
    email: '',
    phone: '',
    userType: '',
    isError: false,
    accessToken: '',
    refreshToken: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        register: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone || '';
            state.userType = action.payload.userType || '';
            state.isError = false;
            state.islogged = true;
            
            localStorage.setItem('user', JSON.stringify(state));
        },
        login: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.userType = action.payload.userType || '';
            state.islogged = true;
            state.isError = false;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            localStorage.setItem('user', JSON.stringify(state));
        },
        logout: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.userType = '';
            state.islogged = false;
            state.accessToken = '';
            state.refreshToken = '';
            
            localStorage.removeItem('user');
        },
        setError: (state, action) => {
            state.isError = action.payload;
        }
    }
});

export const { register, login, logout, setError } = userSlice.actions;
export default userSlice.reducer;
