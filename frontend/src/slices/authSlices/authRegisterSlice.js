import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: '',
  email: '',
  phone: '',
  userType: '',
  islogged: false,
};

export const authRegisterSlice = createSlice({
  name: 'authRegister',
  initialState,
  reducers: {
    register: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone || '';
      state.userType = action.payload.userType || '';
      state.islogged = true;
    },
  },
});

export const { register } = authRegisterSlice.actions;
export default authRegisterSlice.reducer;
