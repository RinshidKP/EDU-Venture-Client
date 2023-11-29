import axios from 'axios'
import { apiUrls } from '../config/apiURL';

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
