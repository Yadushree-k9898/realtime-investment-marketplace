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
  
  const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
      case REGISTER_REQUEST:
      case LOAD_USER_REQUEST:
        return { ...state, loading: true, error: null };
  
      case LOGIN_SUCCESS:
      case REGISTER_SUCCESS:
      case LOAD_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          isAuthenticated: true,
          error: null
        };
  
      case LOGIN_FAILURE:
      case REGISTER_FAILURE:
      case LOAD_USER_FAILURE:
        return {
          ...state,
          loading: false,
          user: null,
          isAuthenticated: false,
          error: action.payload
        };
  
      case LOGOUT:
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        };
  
      default:
        return state;
    }
  };
  
  export default authReducer;
  