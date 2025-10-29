import { useState, useEffect } from "react";
import { Spinner } from "@/components";
import { useBattlePair, useSubmitBattleWinner } from "@/api/battle";
import { useQueryClient } from "@tanstack/react-query";

const InfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Как работает дуэль?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Нас пускают по внешности? Нет.
          <br />
          Будут ли нас судить по внешности? Да 💫
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#A53860] hover:bg-[#8B2F4F] text-white font-semibold py-4 rounded-2xl transition-colors"
        >
          Ок
        </button>
      </div>
    </div>
  );
};

const LimitReachedModal = ({ timeLeft }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Ты достиг лимита сравнений 😊
        </h2>
        <div className="flex justify-center items-center gap-2 my-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#A53860]">
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">ч</div>
          </div>
          <div className="text-4xl font-bold text-[#A53860]">:</div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#A53860]">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">м</div>
          </div>
          <div className="text-4xl font-bold text-[#A53860]">:</div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#A53860]">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">с</div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Сегодня вы встретились,
          <br />а завтра всё может измениться 💫
        </p>
      </div>
    </div>
  );
};

const WinnerModal = ({ winnerName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Победитель дуэли!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          {winnerName} побеждает в этом раунде! 🎉
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#A53860] hover:bg-[#8B2F4F] text-white font-semibold py-4 rounded-2xl transition-colors"
        >
          Завершить дуэль
        </button>
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, onClick, disabled }) => {
  const calculateAge = (birthdate) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden ${disabled ? "opacity-50" : "cursor-pointer"}`}
      onClick={disabled ? undefined : onClick}
    >
      <img
        src={profile.photos[0]}
        alt={profile.first_name}
        className="w-full aspect-[3/4] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="text-white">
          <div className="text-xl font-semibold">
            @{profile.instagram_username}
          </div>
          <div className="text-sm opacity-90">
            {calculateAge(profile.birthdate)} лет
          </div>
        </div>
      </div>
    </div>
  );
};

export const DuelsPage = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 44, seconds: 55 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useBattlePair();
  const submitWinner = useSubmitBattleWinner();

  useEffect(() => {
    if (!showLimitModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showLimitModal]);

  useEffect(() => {
    setShowInfoModal(true);
  }, []);

  const handleProfileClick = async (winnerId, winnerFirstName) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitWinner.mutateAsync(winnerId);

      if (result && result.profiles && result.profiles.length > 0) {
        await queryClient.invalidateQueries(["battle-pair"]);
        await refetch();
      } else {
        setWinnerName(winnerFirstName);
        setShowWinnerModal(true);
      }
    } catch (error) {
      console.error("Error submitting winner:", error);
      if (error.response?.status === 429 || error.response?.data?.error?.includes("limit")) {
        setShowLimitModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWinnerModalClose = () => {
    setShowWinnerModal(false);
    setShowLimitModal(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data || !data.profiles || data.profiles.length < 2) {
    if (error?.response?.status === 429 || error?.response?.data?.error?.includes("limit")) {
      return (
        <div className="w-full min-h-[calc(100vh-169px)] p-5 flex flex-col items-center justify-center">
          <LimitReachedModal timeLeft={timeLeft} />
        </div>
      );
    }

    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-5">
        <p className="text-gray-500 dark:text-gray-300">
          Не удалось загрузить пары для дуэли
        </p>
      </div>
    );
  }

  const [profile1, profile2] = data.profiles;
  const stage = data.stage || 1;
  const totalStages = 15;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col">
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Закрыть
          </button>
          <h1 className="text-xl font-bold dark:text-white flex items-center gap-1">
            Luvo
            <span className="text-red-500">❤️</span>
          </h1>
          <div className="w-16" />
        </div>

        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#A53860] transition-all duration-300"
            style={{ width: `${(stage / totalStages) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {stage} из {totalStages} сравнений
        </p>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
        <ProfileCard
          profile={profile1}
          onClick={() => handleProfileClick(profile1.id, profile1.first_name)}
          disabled={isSubmitting}
        />
        <ProfileCard
          profile={profile2}
          onClick={() => handleProfileClick(profile2.id, profile2.first_name)}
          disabled={isSubmitting}
        />
      </div>

      <div className="p-4 text-center">
        <button
          onClick={() => setShowInfoModal(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
        >
          Как это работает?
        </button>
      </div>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showLimitModal && <LimitReachedModal timeLeft={timeLeft} />}
      {showWinnerModal && (
        <WinnerModal winnerName={winnerName} onClose={handleWinnerModalClose} />
      )}
    </div>
  );
};
