
import { configureStore } from '@reduxjs/toolkit';
import authAdminLoginReducer from '../slices/authSlices/authAdminLoginSlice';
import authRegisterReducer from '../slices/authSlices/authRegisterSlice';
import authLogoutReducer from '../slices/authSlices/authLogoutSlice';
import authLoginReducer from '../slices/authSlices/authLoginSlice';
import authTokenUpdateReducer from '../slices/authSlices/authTokenUpdateSlice';
import barberProfileReducer from '../slices/profile/barberProfile/barberProfileSlice';
import customerProfileReducer from '../slices/profile/customerProfile/customerProfileSlice';
import adminProfileReducer from '../slices/profile/adminProfile/adminProfileSlice';
import authForgotReducer from '../slices/authSlices/authForgotSlice';
import customerReducer from '../slices/adminManagement/customer/customerSlice'

export const store = configureStore({
  reducer: {
    authRegister: authRegisterReducer,
    authLogin: authLoginReducer,
    authAdminLogin: authAdminLoginReducer,
    authLogout: authLogoutReducer,
    authTokenUpdate: authTokenUpdateReducer,
    barberProfile: barberProfileReducer,
    customerProfile: customerProfileReducer,
    adminProfile: adminProfileReducer,
    authForgot: authForgotReducer,
    customers:customerReducer ,
  },
});


