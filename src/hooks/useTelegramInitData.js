import { useEffect, useState } from "react";

export const useTelegramInitData = () => {
  const [initData, setInitData] = useState("");
  const [initDataUnsafe, setInitDataUnsafe] = useState({});
  const [telegramUsername, setTelegramUsername] = useState("");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      setInitData(window.Telegram.WebApp.initData);
      const unsafe = window.Telegram.WebApp.initDataUnsafe;
      setInitDataUnsafe(unsafe);
      setTelegramUsername(unsafe?.user?.username || "");
    }
  }, []);

  return { initData, initDataUnsafe, telegramUsername };
};
