import { useEffect, useState } from "react";
import { Layout } from "./components";

export default function App() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
      setDate(tg.initDataUnsafe);
    }
    tg?.expand();
  }, []);

  return (
    <Layout>
      <div className="max-w-md mx-auto w-full h-full p-4">
        {user ? (
          <div>
            <h1 className="text-2xl font-bold">Привет, {user.first_name}!</h1>

            <p className="text-gray-600 text-sm">Ваш Telegram ID: {user.id}</p>

            <div className="mt-4 p-4 rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">
                Данные пользователя:
              </h2>

              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(date, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Ожидаем загрузку Telegram WebApp...</p>
        )}
      </div>
    </Layout>
  );
}
