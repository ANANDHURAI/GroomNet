import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  email: '',
  phone: '',
  userType: '',
  islogged: false,
  accessToken: '',
  refreshToken: '',
  isAdmin: false,
  isSuperuser: false,
};

export const authLogoutSlice = createSlice({
  name: 'authLogout',
  initialState,
  reducers: {
    logout: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { logout } = authLogoutSlice.actions;
export default authLogoutSlice.reducer;
