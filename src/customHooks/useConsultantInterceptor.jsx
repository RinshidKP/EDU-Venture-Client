import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { consultentApi } from '../apiRoutes/studentAPI';
const useConsultantInterceptor = () => {
    const { Token, Role } = useSelector((state) => state.User);
    const navigate = useNavigate();
    useEffect(() => {
      // Request interceptor
      const reqInterceptor = (config) => {
        // Modify request configuration, e.g., set headers
        config.headers['Authorization'] = Token
        config.headers['userRole'] = Role;
        return config;
      };
  
      // Response interceptor
      const resInterceptor = (response) => response;
  
      // Error interceptor
      const errInterceptor = (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        return Promise.reject(error);
      };
  
      const reqInterceptorId = consultentApi.interceptors.request.use(reqInterceptor);
      const resInterceptorId = consultentApi.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        consultentApi.interceptors.request.eject(reqInterceptorId);
        consultentApi.interceptors.response.eject(resInterceptorId);
      };
    }, []);
  
    return consultentApi
  };
  
  export default consultentApi;

export { useConsultantInterceptor}

