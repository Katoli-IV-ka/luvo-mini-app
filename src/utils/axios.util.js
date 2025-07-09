import axios from "axios";
import { decodeJWT } from "./decode-jwt.util";
import { useWebAppStore } from "../store";
import { getAccessToken } from "./get-auth-tokens.util";
import { loginByInitData } from "./login-by-init-data.util";
import { checkTokenExpiration } from "./check-token.util";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = getAccessToken();
      if (token) {
        if (!checkTokenExpiration()) {
          return Promise.reject(new Error("Token expired"));
        }
        config.headers.Authorization = token;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.status === 403 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const { logout, init, setUser } = useWebAppStore.getState();

        logout();
        const initData = await init();

        if (!initData) throw new Error("Не удалось получить initData");

        const data = await loginByInitData(initData);
        const { access_token, has_profile } = data;

        if (!access_token) throw new Error("Токен отсутствует");

        const { user_id, exp } = decodeJWT(access_token);
        setUser({
          id: user_id,
          accessToken: access_token,
          isRegister: has_profile,
          exp,
        });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Ошибка при перелогине:", err);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
