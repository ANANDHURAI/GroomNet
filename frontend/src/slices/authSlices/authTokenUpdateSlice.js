import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: '',
  refreshToken: '',
};

export const authTokenUpdateSlice = createSlice({
  name: 'authTokenUpdate',
  initialState,
  reducers: {
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
    },
  },
});

export const { updateTokens } = authTokenUpdateSlice.actions;
export default authTokenUpdateSlice.reducer;
