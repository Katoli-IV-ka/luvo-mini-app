import { useState } from "react";
import { Button } from "@/ui";
import { Spinner, DuelCard } from "@/components";
import { useDuelUsers, useDuelVote } from "@/api/duels";

export const DuelsPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: voteDuel, isPending: isVoting } = useDuelVote();
  const { data: duelData, isLoading, error, refetch } = useDuelUsers();

  const handleUserSelect = (userId) => {
    if (isVoting) return;
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleConfirm = () => {
    if (!duelData?.users || !selectedUserId || isVoting) return;

    const loserId = duelData.users.find((u) => u.id !== selectedUserId)?.id;
    if (!loserId) return;

    voteDuel(
      { winnerId: selectedUserId, loserId },
      {
        onSuccess: () => {
          setSelectedUserId(null);
          refetch();
        },
      }
    );
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
      <div className="w-full flex items-center justify-center overflow-y-auto scrollbar-hidden">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Ошибка загрузки
        </h2>

        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Не удалось загрузить пользователей для дуэли
        </p>

        <button
          onClick={() => refetch()}
          className="bg-primary-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!duelData?.users || duelData.users.length < 2) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Недостаточно пользователей
          </h2>

          <p className="text-gray-500 dark:text-gray-300">
            Для проведения дуэли нужно минимум 2 пользователя
          </p>
        </div>
      </div>
    );
  }

  const [user1, user2] = duelData.users;

  return (
    <div className="w-full p-5 overflow-y-auto scrollbar-hidden">
      {/* Заголовок */}
      <h1 className="text-md sm:text-3xl font-medium mb-6 text-gray-500 dark:text-gray-300 text-center">
        Нас пускают по внешности? Нет.
        <br /> Будут ли нас судить по внешности? Да.
      </h1>

      {/* Карточки пользователей */}
      <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 max-w-full px-2 flex-nowrap max-[360px]:flex-col">
        <div className="animate-fade-in-left">
          <DuelCard
            user={user1}
            onSelect={handleUserSelect}
            isSelected={selectedUserId === user1.id}
            isWinner={false}
            isLoser={false}
            disabled={isVoting}
          />
        </div>

        <div className="animate-fade-in-right">
          <DuelCard
            user={user2}
            onSelect={handleUserSelect}
            isSelected={selectedUserId === user2.id}
            isWinner={false}
            isLoser={false}
            disabled={isVoting}
          />
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="text-center mt-8 space-y-4">
        <Button
          className="mt-3 w-full"
          type="button"
          styleType="secondary"
          onClick={() => {
            setSelectedUserId(null);
            refetch();
          }}
          disabled={isVoting}
        >
          {!isLoading ? "Новая дуэль" : <Spinner size="sm" />}
        </Button>

        <Button
          className="mt-3 w-full"
          type="button"
          onClick={handleConfirm}
          disabled={!selectedUserId || isVoting}
        >
          {isVoting ? <Spinner size="sm" /> : "Выбрать"}
        </Button>
      </div>
    </div>
  );
};
