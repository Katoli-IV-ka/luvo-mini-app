import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components";
import { useBattlePair } from "@/api/battle";

const BattleProfileCard = ({ profile, onSelect, disabled }) => {
  const firstPhoto = profile?.photos?.[0] ?? null;
  const initials = profile?.instagram_username?.[0]?.toUpperCase() ?? "?";
  const instagramUsername = profile?.instagram_username
    ? profile.instagram_username.startsWith("@")
      ? profile.instagram_username
      : `@${profile.instagram_username}`
    : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-[24px] border border-gray-200 bg-white text-left shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-90 dark:border-white/10 dark:bg-gray-900"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {firstPhoto ? (
          <img
            src={firstPhoto}
            alt={instagramUsername || "Участник баттла"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-red/80 to-primary-red text-white">
            <span className="text-4xl font-semibold">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {instagramUsername && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-lg font-semibold text-white drop-shadow">
              {instagramUsername}
            </p>
          </div>
        )}
      </div>
      <div className="px-4 pb-4">
        {!instagramUsername && (
          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Instagram не указан
          </p>
        )}
        <p className="mt-3 text-center text-sm font-semibold text-primary-red transition-colors group-hover:text-primary-red/80">
          Выбрать победителя
        </p>
      </div>
    </button>
  );
};

export const DuelsPage = () => {
  const [stage, setStage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutateAsync: loadPair } = useBattlePair();

  const fetchPair = useCallback(
    async ({ winnerId, initial = false } = {}) => {
      if (initial) {
        setIsInitialLoading(true);
      } else {
        setIsUpdating(true);
      }
      setError(null);

      try {
        const data = await loadPair(winnerId);
        const receivedProfiles = Array.isArray(data?.profiles)
          ? data.profiles
          : [];

        setStage(data?.stage ?? null);
        setProfiles(receivedProfiles);

        if (!receivedProfiles.length) {
          setError("Новых участников для баттла пока нет. Загляните позже!");
        }
      } catch (err) {
        console.error("Ошибка загрузки баттла:", err);
        const responseMessage =
          err?.response?.data?.detail ||
          err?.message ||
          "Не удалось загрузить данные. Попробуйте обновить страницу.";
        setError(responseMessage);
      } finally {
        if (initial) {
          setIsInitialLoading(false);
        } else {
          setIsUpdating(false);
        }
      }
    },
    [loadPair]
  );

  useEffect(() => {
    fetchPair({ initial: true });
  }, [fetchPair]);

  const displayedProfiles = useMemo(
    () => profiles.slice(0, 2),
    [profiles]
  );

  const handleWinnerSelect = (winnerId) => {
    if (!winnerId || isUpdating) return;
    fetchPair({ winnerId });
  };

  return (
    <div className="w-full min-h-[calc(100vh-169px)] p-5 pb-6 flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Баттл
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Выберите, кто из участников вам нравится больше. Мы покажем новую пару
          сразу после вашего выбора.
        </p>
      </div>

      {stage && (
        <div className="mx-auto rounded-full bg-primary-red/10 px-4 py-2 text-sm font-medium text-primary-red">
          Этап {stage}
        </div>
      )}

      {error && !isInitialLoading && (
        <div className="rounded-2xl bg-red-100 px-4 py-3 text-center text-sm text-red-700 dark:bg-red-500/20 dark:text-red-200">
          {error}
        </div>
      )}

      {isInitialLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="relative flex flex-1 flex-col">
          {displayedProfiles.length >= 2 ? (
            <>
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                {displayedProfiles.map((profile) => (
                  <BattleProfileCard
                    key={profile.id}
                    profile={profile}
                    onSelect={() => handleWinnerSelect(profile.id)}
                    disabled={isUpdating}
                  />
                ))}
              </div>
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-[32px] bg-white/80 backdrop-blur-sm dark:bg-black/50">
                  <Spinner size="md" />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-gray-600 dark:text-gray-400">
              Новых участников для баттла пока нет. Загляните позже!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
