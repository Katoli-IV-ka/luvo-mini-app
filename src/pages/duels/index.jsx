import { useState, useEffect } from "react";
import { Spinner } from "@/components";

// Функция для вычисления времени до следующего понедельника
const getNextMonday = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Если воскресенье, то до понедельника 1 день

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0); // Устанавливаем начало дня

  return nextMonday;
};

// Компонент отсчета времени
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Сначала вычисляем начальное время
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Сразу устанавливаем начальное время
    calculateTime();
    setIsInitialized(true);

    // Затем запускаем интервал
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center mt-8">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary-red bg-white/90 dark:bg-black/90 rounded-lg px-4 py-2 min-w-[80px]">
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          дней
        </div>
      </div>

      <div className="text-2xl font-bold text-primary-red">:</div>

      <div className="text-center">
        <div className="text-3xl font-bold text-primary-red bg-white/90 dark:bg-black/90 rounded-lg px-4 py-2 min-w-[80px]">
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          часов
        </div>
      </div>

      <div className="text-2xl font-bold text-primary-red">:</div>

      <div className="text-center">
        <div className="text-3xl font-bold text-primary-red bg-white/90 dark:bg-black/90 rounded-lg px-4 py-2 min-w-[80px]">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          минут
        </div>
      </div>

      <div className="text-2xl font-bold text-primary-red">:</div>

      <div className="text-center">
        <div className="text-3xl font-bold text-primary-red bg-white/90 dark:bg-black/90 rounded-lg px-4 py-2 min-w-[80px]">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          секунд
        </div>
      </div>
    </div>
  );
};

export const DuelsPage = () => {
  const [nextMonday, setNextMonday] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNextMonday(getNextMonday());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] p-5 dark:from-gray-900 dark:to-gray-800 text-center flex flex-col justify-center">
      <div className="transform -translate-y-[10%]">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚔️</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Скоро начнутся дуэли!
        </h2>

        <p className="text-gray-500 dark:text-gray-300 mb-10">
          Нас пускают по внешности? Нет.
          <br /> Будут ли нас судить по внешности? Да.
        </p>

        {nextMonday && <CountdownTimer targetDate={nextMonday} />}

        <p className="text-gray-500 dark:text-gray-300 mt-4">
          Новый функционал дуэлей откроется в понедельник. Вы сможете голосовать
          за более привлекательных пользователей!
        </p>
      </div>
    </div>
  );
};
