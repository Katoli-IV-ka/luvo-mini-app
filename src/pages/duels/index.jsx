import { useEffect, useMemo, useState } from "react";
import { useBattlePair, useBattleVote } from "@/api/battle";
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
    <div className="flex justify-center items-center gap-2 mt-6">
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

const normalizeUsername = (username) => {
  if (!username) return null;
  return username.startsWith("@") ? username.slice(1) : username;
};

const BattleProfileCard = ({ profile, onSelect, disabled, isProcessing }) => {
  const instagram = normalizeUsername(profile.instagram_username);
  const photo = profile.photos?.[0];

  const handleClick = () => {
    if (disabled) return;
    onSelect(profile.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`group flex w-full flex-col rounded-3xl border border-white/40 bg-white/95 p-3 text-left shadow-xl transition-transform duration-200 dark:border-white/10 dark:bg-black/70 sm:p-4 ${
        disabled ? "cursor-not-allowed opacity-80" : "hover:-translate-y-1 hover:shadow-2xl"
      } ${isProcessing ? "border-primary-red shadow-2xl" : ""}`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        {photo ? (
          <img
            src={photo}
            alt={profile.first_name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Фото отсутствует
          </div>
        )}

        {instagram && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <p className="text-xl font-bold text-white sm:text-2xl">@{instagram}</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <span className="inline-flex w-full items-center justify-center rounded-2xl bg-primary-red px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 group-hover:bg-primary-red/90 sm:text-base">
          {isProcessing ? "Голосуем..." : "Голосовать"}
        </span>
      </div>
    </button>
  );
};

export const DuelsPage = () => {
  const nextBattleDate = useMemo(() => getNextMonday(), []);
  const { data, isError, isLoading, refetch } = useBattlePair();
  const { mutate: sendVote, isPending: isVotePending } = useBattleVote();

  const [pendingWinnerId, setPendingWinnerId] = useState(null);
  const [voteError, setVoteError] = useState(null);

  useEffect(() => {
    if (!data?.profiles?.length) return;

    data.profiles.forEach((profile) => {
      profile.photos?.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    });
  }, [data]);

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasPair = data?.profiles?.length === 2;

  const handleVote = (winnerId) => {
    if (!winnerId || isVotePending) return;

    setVoteError(null);
    setPendingWinnerId(winnerId);

    sendVote(winnerId, {
      onError: () => {
        setVoteError("Не удалось отправить голос. Попробуйте ещё раз.");
      },
      onSettled: () => {
        setPendingWinnerId(null);
      },
    });
  };

  return (
    <div className="min-h-screen w-full px-4 pb-10 pt-6 text-center">
      <h3 className="text-sm text-gray-500 dark:text-gray-300">
        Нас пускают по внешности? Нет.
        <br /> Будут ли нас судить по внешности? Да.
      </h3>

      {isError ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-red-500">
            Не удалось загрузить дуэль. Попробуйте обновить страницу.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-primary-red px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-red/90"
          >
            Обновить
          </button>
        </div>
      ) : hasPair ? (
        <>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Этап {data.stage ?? "-"}
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Выберите, кто проходит дальше
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
            {data.profiles.map((profile) => (
              <BattleProfileCard
                key={profile.id}
                profile={profile}
                onSelect={handleVote}
                disabled={isVotePending}
                isProcessing={isVotePending && pendingWinnerId === profile.id}
              />
            ))}
          </div>

          {voteError && (
            <p className="mt-4 text-sm text-red-500">{voteError}</p>
          )}
        </>
      ) : (
        <>
          {nextBattleDate && <CountdownTimer targetDate={nextBattleDate} />}

          <p className="text-gray-500 dark:text-gray-300 mt-4">
            Новый функционал откроется в понедельник. Вы сможете голосовать за более
            привлекательных пользователей!
          </p>
        </>
      )}
    </div>
  );
};
