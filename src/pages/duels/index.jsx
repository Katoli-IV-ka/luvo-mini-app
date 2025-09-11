import { useEffect, useRef, useState } from "react";
import { Spinner, DuelCard } from "@/components";
import { useDuelPair, useDuelNextPair } from "@/api/duels";

export const DuelsPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [cardSize, setCardSize] = useState(300);

  const { mutate: nextPair, isPending: isVoting } = useDuelNextPair();
  const { data: pairData, isLoading, error, refetch } = useDuelPair();

  const containerRef = useRef(null);

  useEffect(() => {
    const recalc = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const STATIC_PX = 270; // постоянный контент
      const availableH = Math.max(window.innerHeight - STATIC_PX, 0);
      const perCardMax = availableH / 2;
      const size = Math.floor(Math.max(0, Math.min(perCardMax, width)));
      setCardSize(size);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  const handleSelectAndVote = (winnerId) => {
    if (isVoting || !pairData) return;
    setSelectedUserId(winnerId);
    nextPair(winnerId, {
      onSuccess: () => setSelectedUserId(null),
      onError: () => setSelectedUserId(null),
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
      <div className="w-full flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Ошибка загрузки
          </h2>
          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!pairData?.user || !pairData?.opponent) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Недостаточно данных
          </h2>
          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  const user1 = pairData.user;
  const user2 = pairData.opponent;

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-169px)] px-4 pb-4 overflow-hidden flex flex-col"
    >
      {/* Текст фиксированной высоты */}
      <div className="shrink-0 py-3 text-center">
        <h1 className="text-md font-medium text-gray-500 dark:text-gray-300">
          Нас пускают по внешности? Нет.
          <br /> Будут ли нас судить по внешности? Да.
        </h1>
      </div>

      {/* Две карточки строго в видимой области */}
      <div className="grow flex flex-col items-stretch justify-start gap-3 overflow-hidden">
        <DuelCard
          user={user1}
          onSelect={handleSelectAndVote}
          disabled={isVoting}
          style={{ height: `${cardSize}px` }}
        />
        <DuelCard
          user={user2}
          onSelect={handleSelectAndVote}
          disabled={isVoting}
          style={{ height: `${cardSize}px` }}
        />
      </div>

      {isVoting && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-black/40 text-white rounded-full px-3 py-1">
            <Spinner size="sm" />
            <span>Отправляем...</span>
          </div>
        </div>
      )}
    </div>
  );
};
