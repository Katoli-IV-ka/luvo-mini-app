import { create } from "zustand";

const LOCAL_STORAGE_TOKEN_KEY = "token";

const isMockMode = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("mock") === "1";
};

export const useWebAppStore = create((set, get) => ({
  user: null,
  webApp: null,
  initData: null,
  isRegister: false,
  accessToken: localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || null,

  error: null,
  loading: false,

  setUser: (user) => set({ user }),
  setWebApp: (webApp) => set({ webApp }),
  setInitData: (initData) => set({ initData }),
  setIsRegister: (isRegister) => set({ isRegister }),
  setAccessToken: (token) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    set({ accessToken: token });
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  init: async () => {
    set({ loading: true, error: null });
    try {
      const tg = window.Telegram?.WebApp;
      const isTelegram = tg && tg.initData && tg.initDataUnsafe?.user;
      const isDev = import.meta.env.DEV;
      const mockEnabled = isMockMode();

      if (isTelegram && !mockEnabled) {
        tg.ready();
        tg.expand();
        set({
          webApp: tg,
          user: tg.initDataUnsafe.user,
          initData: tg.initData,
        });
        return tg.initData; // вернём initData для запроса токена
      }

      if (isDev || mockEnabled) {
        const decoded = decodeURIComponent(import.meta.env.VITE_FAKE_INIT_DATA);
        const params = new URLSearchParams(decoded);
        const userJson = params.get("user");
        if (!userJson) throw new Error("Нет user в VITE_FAKE_INIT_DATA");
        const user = JSON.parse(userJson);
        set({
          webApp: null,
          user,
          initData: decoded,
        });
        return decoded;
      }

      throw new Error("Telegram WebApp не доступен");
    } catch (e) {
      set({ error: e.message || "Ошибка инициализации" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    set({
      user: null,
      webApp: null,
      initData: null,
      accessToken: null,

      error: null,
    });
  },
}));
