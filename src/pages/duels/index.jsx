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

const getAgeFromBirthdate = (birthdate) => {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
};

const normalizeUsername = (username) => {
  if (!username) return null;
  return username.startsWith("@") ? username.slice(1) : username;
};

const BattleProfileCard = ({ profile, onSelect, disabled, isProcessing }) => {
  const age = getAgeFromBirthdate(profile.birthdate);
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
      className={`group flex w-full flex-col rounded-3xl border border-white/30 bg-white/90 p-4 text-left shadow-xl transition-transform duration-200 dark:border-white/10 dark:bg-black/60 ${
        disabled ? "cursor-not-allowed opacity-80" : "hover:-translate-y-1 hover:shadow-2xl"
      } ${isProcessing ? "border-primary-red shadow-2xl" : ""}`}
    >
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
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
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.first_name}
          {age !== null && (
            <span className="ml-2 text-lg font-medium text-gray-500 dark:text-gray-400">
              {age} лет
            </span>
          )}
        </p>

        {instagram && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">@{instagram}</p>
        )}

        {profile.about && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{profile.about}</p>
        )}
      </div>

      <div className="mt-6">
        <span className="inline-flex w-full items-center justify-center rounded-2xl bg-primary-red px-4 py-3 text-base font-semibold text-white transition-colors duration-200 group-hover:bg-primary-red/90">
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
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
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
    <div className="w-full min-h-[calc(100vh-169px)] p-5 text-center dark:from-gray-900 dark:to-gray-800">
      <h3 className="text-md text-gray-500 dark:text-gray-300">
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
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Этап {data.stage ?? "-"}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Выберите, кто проходит дальше
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
