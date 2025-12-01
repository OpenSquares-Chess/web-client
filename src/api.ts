import axios from 'axios';
import { keycloak } from './keycloak';

const api = axios.create({
  baseURL: 'https://accounts.opensquares.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = keycloak.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

