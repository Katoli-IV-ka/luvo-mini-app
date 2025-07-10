import axios from "axios";
import { decodeJWT } from "./decode-jwt.util";
import { useWebAppStore } from "../store";
import { getAccessToken } from "./get-auth-tokens.util";
import { checkTokenExpiration } from "./check-token.util";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403) {
      const { logout } = useWebAppStore.getState();
      logout();
      window.location.href = "/registration";
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { logout, init, setUser } = useWebAppStore.getState();
        logout();

        const initData = await init();
        if (!initData) throw new Error("initData не получен");

        const data = await loginByInitData(initData);
        const { access_token, has_profile } = data;
        if (!access_token) throw new Error("Токен отсутствует");

        const { exp, user_id } = decodeJWT(access_token);
        setUser({
          id: user_id,
          exp,
          isRegister: has_profile,
          accessToken: access_token,
        });

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        window.location.href = "/";
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
