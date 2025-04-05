// src/pages/Auth/LogoutPage.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Dispatch logout action to clear Redux state and localStorage
    dispatch(logout());

    // Redirect to login page
    navigate('/login');
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
