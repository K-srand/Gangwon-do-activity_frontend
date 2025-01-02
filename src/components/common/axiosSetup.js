// axiosSetup.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://gangwonactivity.site/api/v1";

const REQUEST = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

REQUEST.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// REQUEST.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem('token');
//             const navigate = useNavigate();
//             navigate('/login');
//         }
//         return Promise.reject(error);
//     }
// );

export { REQUEST };
