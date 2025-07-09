import axios from "axios";
import { decodeJWT } from "./decode-jwt.util";
import { useWebAppStore } from "../store";
import { loginByInitData } from "./login-by-init-data.util";
import { checkTokenExpiration } from "./check-token.util";
import { getAccessToken, saveTokens } from "./get-auth-tokens.util";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// — Добавляем accessToken в каждый запрос
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      if (!checkTokenExpiration()) {
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
}

// — Перехватчик ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { logout, init, setUser } = useWebAppStore.getState();
        logout();

        const initData = await init();
        if (!initData) throw new Error("initData не получен");

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

        saveTokens({ access_token });

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
