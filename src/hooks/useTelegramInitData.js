import { useEffect, useState } from "react";

export const useTelegramInitData = () => {
  const [initData, setInitData] = useState("");
  const [initDataUnsafe, setInitDataUnsafe] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.warn("Telegram WebApp не доступен");
      return;
    }

    const data = tg.initData;

    if (!data || data === "") {
      console.warn("initData пустой — скорее всего, запуск не из Telegram");
      return;
    }

    setInitData(data);
    setInitDataUnsafe(tg.initDataUnsafe);

    navigator.clipboard
      .writeText(data)
      .then(() => {
        console.log("initData скопирована в буфер обмена");
      })
      .catch((err) => {
        console.warn("Не удалось скопировать initData:", err);
      });
  }, []);

  return { initData, initDataUnsafe };
};
