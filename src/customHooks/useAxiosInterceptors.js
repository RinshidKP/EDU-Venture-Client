import { useSelector } from 'react-redux';
import axios from 'axios';

export  const useAxiosInterceptors = () => {
  const { Token, Role } = useSelector((state) => state.User);
  console.log(Role,Token);
   const setupInterceptors = () => {

    axios.interceptors.request.use(
      (config) => {
        if (Token && Role) {
            console.log(Role,Token);
          config.headers['Authorization'] = 'Bearer ' + Token;
          config.headers['User-Role'] = Role;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject();
    };
  };
  
  return { setupInterceptors };
};
