
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    islogged: false,
    email: '',
    phone: '',
    userType: '',
    accessToken: '',
    refreshToken: '',
    isAdmin: false,
    isSuperuser: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        register: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone || '';
            state.userType = action.payload.userType || '';
            state.islogged = true;
            
        },
        login: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.userType = action.payload.userType || '';
            state.phone = action.payload.phone || '';
            state.islogged = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAdmin = false;
            state.isSuperuser = false;

           
            const userData = {
                name: state.name,
                email: state.email,
                userType: state.userType,
                phone: state.phone,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAdmin: false,
                isSuperuser: false
            };
            localStorage.setItem('user', JSON.stringify(userData));
        },
        adminLogin: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.islogged = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAdmin = true;
            state.isSuperuser = action.payload.isSuperuser || false;

           
            const userData = {
                name: state.name,
                email: state.email,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAdmin: true,
                isSuperuser: state.isSuperuser
            };
            localStorage.setItem('user', JSON.stringify(userData));
        },
        logout: (state) => {
            
            Object.assign(state, initialState);
            
          
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken || state.refreshToken;
            
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            userData.accessToken = action.payload.accessToken;
            if (action.payload.refreshToken) {
                userData.refreshToken = action.payload.refreshToken;
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('access_token', action.payload.accessToken);
            if (action.payload.refreshToken) {
                localStorage.setItem('refresh_token', action.payload.refreshToken);
            }
        }
    }
});

export const { register, login, adminLogin, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;