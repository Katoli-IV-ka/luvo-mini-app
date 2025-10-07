import { useEffect } from "react";

export const useTelegramFullscreen = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    try {
      // Запрос на полноэкранный режим
      tg.requestFullscreen?.();

      // Убираем возможность свайпа вниз
      tg.setSwipeBehavior?.({ allow_vertical_swipe: false });

      // Дополнительно разворачиваем и предотвращаем закрытие
      tg.expand();
      tg.enableClosingConfirmation();
    } catch (e) {
      console.warn("Telegram fullscreen init failed:", e);
    }
  }, []);
};
