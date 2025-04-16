// redux/AuthInitializer.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isOtpVerified = localStorage.getItem('isOtpVerified') === 'true';
    if (token && isOtpVerified) {
      dispatch(login({ token, isOtpVerified: true }));
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
