import { useEffect } from "react";

export const useTelegramFullscreen = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    // Разворачиваем приложение
    try {
      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      } else if (tg.expand) {
        tg.expand();
      } else {
        tg.sendEvent?.("web_app_request_fullscreen");
      }
    } catch (err) {
      console.warn("Ошибка при активации fullscreen:", err);
    }

    // Отключаем вертикальные свайпы (чтобы не сворачивалось)
    try {
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
        console.log("✅ Вертикальные свайпы отключены");
      } else if (tg.setupSwipeBehavior) {
        tg.setupSwipeBehavior({ allow_vertical_swipe: false });
        console.log("✅ Swipe отключен через setupSwipeBehavior");
      } else {
        tg.sendEvent?.("web_app_setup_swipe_behavior", {
          allow_vertical_swipe: false,
        });
        console.log("✅ Swipe отключен через sendEvent");
      }
    } catch (err) {
      console.warn("Ошибка при отключении свайпов:", err);
    }
  }, []);
};
