import axios from 'axios'
import { apiUrls } from '../config/apiURL';
// import { useSelector } from 'react-redux';

export const studentAPI = axios.create({
baseURL: apiUrls.studentUrl
},)

export const consultentApi = axios.create({
    baseURL :apiUrls.consultentUrl
})

export const adminApi = axios.create({
    baseURL :apiUrls.adminUrl
})
export const chatApi = axios.create({
    baseURL :apiUrls.chatUrl
})

export const createStudentAPI = () => {

    const studentAPI = axios.create({
      baseURL: apiUrls.studentUrl,
    });
  
    // studentAPI.interceptors.request.use(
    //   (config) => {
    //     const { Token, Role } = useSelector((state) => state.User);
    //         console.log(Token,Role);
    //     if (Token && Role) {
    //       config.headers['Authorization'] = 'Bearer ' + Token;
    //       config.headers['User-Role'] = Role;
    //     }
  
    //     config.headers['Content-Type'] = 'application/json';
    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   }
    // );
  
    return studentAPI;
  };