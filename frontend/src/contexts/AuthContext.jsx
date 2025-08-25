import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'CLEAR_LOADING':
      return {
        ...state,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'CLEAR_LOADING' });
    }
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: response.data.data.user,
      });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Send OTP
  const sendOTP = async () => {
    try {
      const response = await api.post('/auth/send-otp');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP
  const verifyOTP = async (otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { otp });
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data.user,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;