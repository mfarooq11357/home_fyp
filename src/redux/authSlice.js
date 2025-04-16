// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  isOtpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.isOtpVerified = action.payload.isOtpVerified;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.isOtpVerified = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isOtpVerified');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
