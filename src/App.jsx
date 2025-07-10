import { useEffect } from "react";
import { THEME } from "./constants";
import { Router } from "./router";
import { Layout } from "./components";
import { useLogin } from "./api/auth";
import { decodeJWT } from "./utils/decode-jwt.util";
import { LoadingPage } from "./pages";
import { useNavigate } from "react-router-dom";
import { useWebAppStore } from "./store";

export const App = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useLogin();
  const {
    user,
    init,
    error,
    theme,
    loading,
    setUser,
    setTheme,
    isInitialized,
    setInitialized,
  } = useWebAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle(THEME.DARK, theme === THEME.DARK);
  }, [theme]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg?.onEvent) {
      const handler = () => {
        const newTheme =
          tg.colorScheme === THEME.DARK ? THEME.DARK : THEME.LIGHT;
        setTheme(newTheme);
      };

      handler();
      tg.onEvent("themeChanged", handler);

      return () => {
        tg.offEvent?.("themeChanged", handler);
      };
    }
  }, [setTheme]);

  useEffect(() => {
    if (!isInitialized && !user?.accessToken) {
      initializeApp();
    }
  }, []);

  const initializeApp = async () => {
    try {
      const initData = await init();
      if (!initData) return;

      const { data } = await mutateAsync({ init_data: initData });
      // THIS SHIT MOMENT WHEN WE NEED REGISTER PROFILE
      const { access_token: token, has_profile: isRegister } = data || {};

      if (!token) {
        console.warn("Token not found in login response.");
        return;
      }

      loginSuccess(token, isRegister);
    } catch (e) {
      console.error("Ошибка инициализации:", e);
    }
  };

  const loginSuccess = (token, isRegister) => {
    try {
      const { user_id, expires_in_ms } = decodeJWT(token);
      setUser({
        id: user_id,
        exp: expires_in_ms,
        isRegister,
        accessToken: token,
      });
      setInitialized(true);
      navigate("/feed");
    } catch (error) {
      console.error("Error during login process:", error);
    }
  };

  if (loading) return <LoadingPage />;

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-light-red">
        <p>Ошибка: {error}</p>
      </div>
    );

  return (
    <Layout className="flex flex-col items-center justify-start bg-white text-black dark:bg-black dark:text-white scrollbar-hidden">
      <Router />
    </Layout>
  );
};
