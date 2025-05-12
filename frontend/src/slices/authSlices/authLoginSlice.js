import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  email: '',
  phone: '',
  userType: '',
  accessToken: '',
  refreshToken: '',
  isAdmin: false,
  isSuperuser: false,
  islogged: false,
};

export const authLoginSlice = createSlice({
  name: 'authLogin',
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userType = action.payload.userType || '';
      state.phone = action.payload.phone || '';
      state.islogged = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAdmin = false;
      state.isSuperuser = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { login } = authLoginSlice.actions;
export default authLoginSlice.reducer;
