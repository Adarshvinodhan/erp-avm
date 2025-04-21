import axios from 'axios';

const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

});

// Add a request interceptor to dynamically set the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle errors during request setup
    return Promise.reject(error);
  }
);

export default api;