import { useEffect, useState } from "react";

export const Layout = ({ children, className = "" }) => {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    setIsTelegramWebApp(!!tg);

    // Устанавливаем высоту viewport с учетом мобильных браузеров
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      setViewportHeight(`${vh}px`);
    };

    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div
      className={`min-h-screen w-full bg-white ${className}`}
      style={{
        height: isTelegramWebApp ? "100%" : viewportHeight,
        paddingTop: isTelegramWebApp ? "0" : "env(safe-area-inset-top)",
        paddingBottom: isTelegramWebApp ? "0" : "env(safe-area-inset-bottom)",
      }}
    >
      {children}
    </div>
  );
};
