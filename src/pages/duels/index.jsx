import { useEffect, useState } from "react";
import { Spinner, DuelCard } from "@/components";
import { useDuelPair, useDuelNextPair } from "@/api/duels";

export const DuelsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: nextPair, isPending: isVoting } = useDuelNextPair();
  const { data: pairData, isLoading, error, refetch } = useDuelPair();

  useEffect(() => {
    const hasSeen = localStorage.getItem("duelsHelpStatus");
    if (!hasSeen) {
      setShowModal(true);
    }
  }, []);

  const handleSelectAndVote = (winnerId) => {
    if (isVoting || !pairData) return;

    setSelectedUserId(winnerId);
    nextPair(winnerId, {
      onSettled: () => setSelectedUserId(null),
    });
  };

  const handleOk = () => {
    setShowModal(false);
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

      {/* Контейнер карточек */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 overflow-hidden flex-1">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
            <DuelCard
              user={pairData.user}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
            <DuelCard
              user={pairData.opponent}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null}
            />
          </div>
        </div>
      </div>

      {/* Кнопка "Как это работает" */}
      <div className="pb-6 text-center">
        <button
          onClick={() => setShowModal(true)}
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

      {/* Модалка объяснения */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Как работает дуэль?</h2>

            <p className="text-gray-600 text-sm mb-6">
              Перед тобой два профиля. Просто выбери того, кто тебе кажется
              симпатичнее. После выбора автоматически загрузится следующая пара.
              Так мы создаём рейтинг привлекательности среди участников 💫
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={handleOk}
                className="flex-1 bg-primary-red text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
