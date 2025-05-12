import { configureStore } from '@reduxjs/toolkit';
import authAdminLoginReducer from '../slices/authSlices/authAdminLoginSlice';
import authRegisterReducer from '../slices/authSlices/authRegisterSlice';
import authLogoutReducer from '../slices/authSlices/authLogoutSlice';
import authLoginReducer from '../slices/authSlices/authLoginSlice';
import authTokenUpdateReducer from '../slices/authSlices/authTokenUpdateSlice';


export const store = configureStore({
  reducer: {
    authRegister: authRegisterReducer,
    authLogin: authLoginReducer,
    authAdminLogin: authAdminLoginReducer,
    authLogout: authLogoutReducer,
    authTokenUpdate: authTokenUpdateReducer,
  },
});
