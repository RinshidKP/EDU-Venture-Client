import React, { useEffect } from 'react'
import { adminApi } from '../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useAdminAxiosInterceptor = () => {
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
  
      const reqInterceptorId = adminApi.interceptors.request.use(reqInterceptor);
      const resInterceptorId = adminApi.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        adminApi.interceptors.request.eject(reqInterceptorId);
        adminApi.interceptors.response.eject(resInterceptorId);
      };
    }, []);
  
    return adminApi
  
};

  export default adminApi;

export  {useAdminAxiosInterceptor}
