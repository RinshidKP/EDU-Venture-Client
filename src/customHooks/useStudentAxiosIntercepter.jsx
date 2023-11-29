
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../apiRoutes/studentAPI';
const useStudentAxiosIntercepter = () => {
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
  
      const reqInterceptorId = studentAPI.interceptors.request.use(reqInterceptor);
      const resInterceptorId = studentAPI.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        studentAPI.interceptors.request.eject(reqInterceptorId);
        studentAPI.interceptors.response.eject(resInterceptorId);
      };
    }, []);
  
    return studentAPI
  };
  
  export default studentAPI;

export { useStudentAxiosIntercepter}
