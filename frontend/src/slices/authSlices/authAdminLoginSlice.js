import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
  isAdmin: true,
  isSuperuser: false,
  islogged: false,
};

export const authAdminLoginSlice = createSlice({
  name: 'authAdminLogin',
  initialState,
  reducers: {
    adminLogin: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.islogged = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAdmin = true;
      state.isSuperuser = action.payload.isSuperuser || false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { adminLogin } = authAdminLoginSlice.actions;
export default authAdminLoginSlice.reducer;
