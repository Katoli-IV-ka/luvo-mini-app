import { create } from "zustand";

export const useWebAppStore = create((set) => ({
  webApp: null,
  user: null,
  initData: null,
  loading: true,
  error: null,

  setWebApp: (webApp) => set({ webApp }),
  setUser: (user) => set({ user }),
  setInitData: (initData) => set({ initData }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  init: () => {
    set({ loading: true, error: null });
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        set({
          webApp: tg,
          user: tg.initDataUnsafe?.user,
          initData: tg.initData,
        });
      } else {
        set({ error: "Telegram Web App не доступен." });
      }
    } catch (e) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },
}));
