import { useEffect, useState } from "react";

export const useTelegramInitData = () => {
  const [initData, setInitData] = useState("");
  const [initDataUnsafe, setInitDataUnsafe] = useState({});

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      setInitData(window.Telegram.WebApp.initData);
      setInitDataUnsafe(window.Telegram.WebApp.initDataUnsafe);
    }
  }, []);

  return { initData, initDataUnsafe };
};
