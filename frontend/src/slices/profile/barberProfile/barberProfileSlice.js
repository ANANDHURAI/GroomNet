import { createSlice } from '@reduxjs/toolkit';
import fetchBarberProfile from './fetchBarberProfile';
import updateBarberProfile from './updateBarberProfile';

const barberProfileSlice = createSlice({
  name: 'barberProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBarberProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarberProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchBarberProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBarberProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBarberProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateBarberProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = barberProfileSlice.actions;
export default barberProfileSlice.reducer;
