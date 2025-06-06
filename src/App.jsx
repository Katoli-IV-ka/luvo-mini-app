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

  console.log(user);

  return (
    <div className="max-w-md mx-auto w-full h-full p-4">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold">Привет, {user.first_name}!</h1>
          <p className="text-gray-600 text-sm">Ваш Telegram ID: {user.id}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Данные пользователя:</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Ожидаем загрузку Telegram WebApp...</p>
      )}
    </div>
  );
}
