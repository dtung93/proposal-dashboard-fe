import axios from "axios";
import { getAuthToken, removeAuthToken } from "./authService";

const localApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

localApi.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/auth/login")) {
      return config;
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

localApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;

    if (status === 401 && !url?.includes("/auth/login")) {
      removeAuthToken();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default localApi;
