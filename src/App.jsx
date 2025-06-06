import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
    tg?.expand();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 text-center">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold">Привет, {user.first_name}!</h1>
          <p className="text-gray-600 text-sm">Ваш Telegram ID: {user.id}</p>
        </div>
      ) : (
        <p className="text-gray-500">Ожидаем загрузку Telegram WebApp...</p>
      )}
    </div>
  );
}
