import { useEffect, useState } from "react";

export const useTelegramInitData = () => {
  const [initData, setInitData] = useState("");
  const [initDataUnsafe, setInitDataUnsafe] = useState({});
  const [telegramUsername, setTelegramUsername] = useState("");

  useEffect(() => {
    const isDev = import.meta.env.DEV;

    if (isDev) {
      const fakeInitData = import.meta.env.VITE_FAKE_INIT_DATA;
      setInitData(fakeInitData);
    } else if (window.Telegram?.WebApp) {
      setInitData(window.Telegram.WebApp.initData);
      const unsafe = window.Telegram.WebApp.initDataUnsafe;
      setInitDataUnsafe(unsafe);
      setTelegramUsername(unsafe?.user?.username || "");
    }
  }, []);

  return { initData, initDataUnsafe, telegramUsername };
};
