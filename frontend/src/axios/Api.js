import axios from "axios";
axios.defaults.baseURL = 'http://localhost:3001/api/';
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("CC_Token")
        if (token) {
            if (axios.defaults.baseURL == "http://localhost:3000/api/")
                config.headers.authorization = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });
export default axios;