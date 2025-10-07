import { useEffect } from "react";

export const useTelegramFullscreen = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    // Попробуем развернуть при старте
    try {
      if (tg.isFullscreen) {
        console.log("✅ Уже в fullscreen");
        return;
      }

      if (tg.requestFullscreen) {
        tg.requestFullscreen();
        console.log("📱 Fullscreen через requestFullscreen()");
      } else if (tg.sendEvent) {
        tg.sendEvent("web_app_request_fullscreen");
        console.log("📩 Fullscreen через web_app_request_fullscreen");
      } else if (tg.expand) {
        tg.expand();
        console.log("↕️ Fullscreen через expand()");
      }
    } catch (err) {
      console.warn("⚠️ Ошибка при активации fullscreen:", err);
    }

    // 🧠 Фолбэк для iOS — повторим попытку после первого взаимодействия
    const handleUserInteraction = () => {
      if (!tg.isFullscreen && tg.requestFullscreen) {
        tg.requestFullscreen();
      }
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);
};
