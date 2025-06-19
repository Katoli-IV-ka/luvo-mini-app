import { create } from "zustand";
import { USER_STORAGE_KEY } from "../constants";

const isMockMode = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("mock") === "1";
};

export const useWebAppStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {};
  const {
    user = null,
    theme = "light",
    webApp = null,
    initData = null,
    isInitialized = false,
  } = storedUser;

  const updateStorage = (updates) => {
    const current = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {};
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  };

  return {
    user,
    theme,
    webApp,
    initData,
    isInitialized,

    setUser: (user) =>
      set(() => {
        const updated = updateStorage({ user });
        return { user: updated.user };
      }),
    setTheme: (theme) =>
      set(() => {
        const updated = updateStorage({ theme });
        return { theme: updated.theme };
      }),
    setWebApp: (webApp) =>
      set(() => {
        const updated = updateStorage({ webApp });
        return { webApp: updated.webApp };
      }),
    setInitData: (initData) =>
      set(() => {
        const updated = updateStorage({ initData });
        return { initData: updated.initData };
      }),
    setInitialized: (isInitialized) =>
      set(() => {
        const updated = updateStorage({ isInitialized });
        return { isInitialized: updated.isInitialized };
      }),
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

          const theme = tg.colorScheme === "dark" ? "dark" : "light";
          set({ theme });

          tg.onEvent("themeChanged", () => {
            const newTheme = tg.colorScheme === "dark" ? "dark" : "light";
            set({ theme: newTheme });
          });

          set({
            webApp: tg,
            user: tg.initDataUnsafe.user,
            initData: tg.initData,
          });
          return tg.initData;
        }

        if (isDev || mockEnabled) {
          const decoded = decodeURIComponent(
            import.meta.env.VITE_FAKE_INIT_DATA
          );
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
      localStorage.removeItem(USER_STORAGE_KEY);
      set({
        user: null,
        webApp: null,
        initData: null,
      });
    },
  };
});
