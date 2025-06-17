import axios from "axios";
import { getAccessToken } from "./get-auth-tokens.util";
// import { checkTokenExpiration } from "./check-token.util";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = getAccessToken();
      if (token) {
        // if (!checkTokenExpiration()) {
        //   return Promise.reject(new Error("Token expired"));
        // }
        config.headers.Authorization = token;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // checkTokenExpiration();
      console.log("BYE!");
    }
    return Promise.reject(error);
  }
);
