import { useState } from "react";
import { Spinner, DuelCard } from "@/components";
import { useDuelPair, useDuelNextPair } from "@/api/duels";

export const DuelsPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: nextPair, isPending: isVoting } = useDuelNextPair();
  const { data: pairData, isLoading, error, refetch } = useDuelPair();

  const handleSelectAndVote = (winnerId) => {
    if (isVoting || !pairData) return;

    setSelectedUserId(winnerId);
    nextPair(winnerId, {
      onSettled: () => setSelectedUserId(null),
    });
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
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col overflow-hidden">
      {/* Заголовок */}
      <div className="shrink-0 py-4 px-4 text-center">
        <h1 className="text-sm text-gray-500 leading-tight">
          Нас пускают по внешности? Нет.
          <br />
          Будут ли нас судить по внешности? Да.
        </h1>
      </div>

      {/* Контейнер для карточек с мобильными брейкпоинтами ширины */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 overflow-hidden">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[160px] xs:max-w-[240px] ms:max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[380px] xl:max-w-[440px] 2xl:max-w-[520px]">
            <DuelCard
              user={pairData.user}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[160px] xs:max-w-[240px] ms:max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[380px] xl:max-w-[440px] 2xl:max-w-[520px]">
            <DuelCard
              user={pairData.opponent}
              onSelect={handleSelectAndVote}
              disabled={isVoting || selectedUserId !== null}
            />
          </div>
        </div>
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
    </div>
  );
};
