import { useEffect, useState } from "react";
import { useDuelProgressStore } from "@/store/duelProgressStore";
import { useDuelPair, useDuelNextPair } from "@/api/duels";
import { Spinner, DuelCard, DuelProgressBar } from "@/components";

export const DuelsPage = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: nextPair, isPending: isVoting } = useDuelNextPair();
  const { data: pairData, isLoading, error, refetch } = useDuelPair();

  // store
  const { total, increment, isBlocked, limitUntil, refreshFromStorage } =
    useDuelProgressStore();

  // show help modal first time
  useEffect(() => {
    const hasSeen = localStorage.getItem("duelsHelpStatus");
    if (!hasSeen) setShowHelpModal(true);
  }, []);

  // refresh progress store from storage on mount
  useEffect(() => {
    refreshFromStorage();
    // open limit modal if already blocked on load
    if (useDuelProgressStore.getState().isBlocked) {
      setShowLimitModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if blocked becomes true -> show limit modal
  useEffect(() => {
    if (isBlocked) setShowLimitModal(true);
  }, [isBlocked]);

  // remaining time for limit modal (local state auto-updates)
  const [remainingTime, setRemainingTime] = useState(
    limitUntil ? Math.max(limitUntil - Date.now(), 0) : 0
  );
  useEffect(() => {
    if (!isBlocked) {
      setRemainingTime(0);
      return;
    }
    const tick = () => {
      const until = parseInt(
        localStorage.getItem("duels_limit_until_v1") || "0",
        10
      );
      const diff = Math.max(until - Date.now(), 0);
      setRemainingTime(diff);
      if (diff <= 0) {
        // refresh store after expiry
        useDuelProgressStore.getState().refreshFromStorage();
        setShowLimitModal(false);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isBlocked]);

  const formatRemainingTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}ч ${minutes}м ${seconds}с`;
  };

  const handleSelectAndVote = (winnerId) => {
    // block interactions if voting in progress or blocked
    if (isVoting || !pairData || isBlocked) return;

    setSelectedUserId(winnerId);
    nextPair(winnerId, {
      onSettled: () => {
        setSelectedUserId(null);
        increment(); // update persisted counter
      },
    });
  };

  const handleOkHelp = () => {
    setShowHelpModal(false);
    localStorage.setItem("duelsHelpStatus", "seen");
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-3">Ошибка загрузки</h2>
          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!pairData?.user || !pairData?.opponent) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h2 className="text-xl font-bold mb-3">Недостаточно данных</h2>
          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col overflow-hidden relative">
      {/* Заголовок */}
      <div className="shrink-0 py-4 px-4 text-center">
        <h1 className="text-sm text-gray-500 leading-tight">
          Нас пускают по внешности? Нет.
          <br />
          Будут ли нас судить по внешности? Да.
        </h1>
      </div>

      {/* Прогрессбар (над карточками) */}
      <DuelProgressBar />

      {/* Контейнер карточек */}
      <div
        className={`flex flex-col items-center justify-center gap-3 p-4 overflow-hidden flex-1 ${
          isBlocked ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
            <DuelCard
              user={pairData.user}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null || isBlocked}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
            <DuelCard
              user={pairData.opponent}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null || isBlocked}
            />
          </div>
        </div>
      </div>

      {/* "Как это работает" */}
      <div className="pb-6 text-center">
        <button
          onClick={() => setShowHelpModal(true)}
          className="text-gray-400 text-sm underline hover:text-gray-600 transition"
        >
          Как это работает?
        </button>
      </div>

      {/* Индикатор голосования */}
      {isVoting && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-black/70 text-white rounded-full px-4 py-2">
            <Spinner size="sm" />
            <span className="text-sm">Отправляем...</span>
          </div>
        </div>
      )}

      {/* Помощь */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Как работает дуэль?</h2>
            <p className="text-gray-600 text-sm mb-6">
              Перед тобой два профиля. Просто выбери того, кто тебе кажется
              симпатичнее. После выбора автоматически загрузится следующая пара.
              Так мы создаём рейтинг привлекательности среди участников 💫
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleOkHelp}
                className="flex-1 bg-primary-red text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка лимита */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">На сегодня хватит 💫</h2>
            <p className="text-gray-600 text-sm mb-4">
              Ты провёл {total} сравнений. Новые дуэли станут доступны через:
            </p>
            <div className="mb-4 text-lg font-medium">
              {formatRemainingTime(remainingTime)}
            </div>
            <button
              onClick={() => setShowLimitModal(false)}
              className="w-full bg-primary-red text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Хорошо
            </button>
          </div>
        </div>
      )}

      {/* Наложение блокировки (если нужно) */}
      {isBlocked && !showLimitModal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-4 rounded-lg text-center text-gray-600">
            Новые дуэли будут доступны через{" "}
            {formatRemainingTime(remainingTime)}
          </div>
        </div>
      )}
    </div>
  );
};
