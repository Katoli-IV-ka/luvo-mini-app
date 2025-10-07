import { create } from "zustand";
import { THEME, USER_STORAGE_KEY } from "../constants";

const isMockMode = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("mock") === "1";
};

export const useWebAppStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {};
  const {
    user = null,
    theme = THEME.LIGHT,
    error = null,
    webApp = null,
    loading = false,
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
    error,
    webApp,
    loading,
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
    setInitialized: (isInitialized) => set(() => ({ isInitialized })),
    init: async () => {
      set({ loading: true, error: null });

      try {
        const tg = window.Telegram?.WebApp;
        const isTelegram = tg && tg.initData;
        const isDev = import.meta.env.DEV;
        const mockEnabled = isMockMode();

        if (isTelegram && !mockEnabled) {
          tg.ready();
          tg.expand();

          if (tg.requestFullscreen) {
            tg.requestFullscreen();
          } else {
            console.log("Fullscreen API пока не поддерживается в этом клиенте");
          }

          const theme =
            tg.colorScheme === THEME.DARK ? THEME.DARK : THEME.LIGHT;
          set({ theme });

          tg.onEvent("themeChanged", () => {
            const newTheme =
              tg.colorScheme === THEME.DARK ? THEME.DARK : THEME.LIGHT;
            set({ theme: newTheme });
          });

          set({
            user: tg.initDataUnsafe.user,
            webApp: tg,
            initData: tg.initData,
          });

          return tg.initData;
        }

        if (isDev || mockEnabled) {
          const decoded = decodeURIComponent(
            import.meta.env.VITE_FAKE_INIT_DATA
          );
          const initData = import.meta.env.VITE_FAKE_INIT_DATA;
          const params = new URLSearchParams(decoded);
          const userJson = params.get("user");
          if (!userJson) throw new Error("Нет user в VITE_FAKE_INIT_DATA");
          const user = JSON.parse(userJson);

          set({
            user,
            webApp: null,
            initData,
          });

          return initData;
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
        isInitialized: false,
      });
    },
  };
});
