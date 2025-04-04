import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE
  } from '../types/authTypes';
  
  import authService from '../../services/authService';
  
  // Login
  export const login = (credentials) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const data = await authService.login(credentials);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
    }
  };
  
  // Register
  export const register = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const data = await authService.register(userData);
      dispatch({ type: REGISTER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, payload: error.response?.data?.message || error.message });
    }
  };
  
  // Load logged-in user
  export const loadUser = () => async (dispatch) => {
    dispatch({ type: LOAD_USER_REQUEST });
    try {
      const data = await authService.getMe();
      dispatch({ type: LOAD_USER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: LOAD_USER_FAILURE, payload: error.response?.data?.message || error.message });
    }
  };
  
  // Logout
  export const logout = () => async (dispatch) => {
    await authService.logout();
    dispatch({ type: LOGOUT });
  };
  