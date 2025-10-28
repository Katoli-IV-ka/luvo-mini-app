import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components";
import { useBattlePair } from "@/api/battle";

const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  const today = new Date();
  const birthday = new Date(birthDate);
  let age = today.getFullYear() - birthday.getFullYear();

  const hasBirthdayPassedThisYear =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() >= birthday.getDate());

  if (!hasBirthdayPassedThisYear) {
    age -= 1;
  }

  return Number.isFinite(age) && age > 0 ? age : null;
};

const BattleProfileCard = ({ profile, onSelect, disabled }) => {
  const photo = profile?.photos?.[0] ?? null;
  const initials = profile?.first_name?.[0]?.toUpperCase() ?? "?";
  const age = calculateAge(profile?.birthdate);

  return (
    <div className="flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-lg transition-colors dark:border-white/10 dark:bg-gray-900">
      <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800">
        {photo ? (
          <img
            src={photo}
            alt={profile?.first_name || "Участник"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-red/80 to-primary-red text-white">
            <span className="text-4xl font-semibold">{initials}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {profile?.first_name}
            {age ? `, ${age}` : ""}
          </h3>
          {profile?.about && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {profile.about}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
          {profile?.instagram_username && (
            <p>Instagram: {profile.instagram_username}</p>
          )}
          {profile?.telegram_username && (
            <p>Telegram: @{profile.telegram_username}</p>
          )}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onSelect}
          className="mt-auto w-full rounded-full bg-primary-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-red/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Выбрать
        </button>
      </div>
    </div>
  );
};

export const DuelsPage = () => {
  const [stage, setStage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutateAsync: requestPair } = useBattlePair();

  const loadPair = useCallback(
    async ({ winnerId, initial = false } = {}) => {
      setError(null);

      if (initial) {
        setIsInitialLoading(true);
      } else {
        setIsUpdating(true);
      }

      try {
        const data = await requestPair(winnerId);

        const nextProfiles = Array.isArray(data?.profiles)
          ? data.profiles.filter(Boolean).slice(0, 2)
          : [];

        setStage(data?.stage ?? null);
        setProfiles(nextProfiles);

        if (!nextProfiles.length) {
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
    [requestPair]
  );

  useEffect(() => {
    loadPair({ initial: true });
  }, [loadPair]);

  const handleWinnerSelect = (winnerId) => {
    if (!winnerId || isUpdating) return;
    loadPair({ winnerId });
  };

  return (
    <div className="w-full min-h-[calc(100vh-169px)] px-4 py-6">
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-6">
        <header className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Баттл
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Выберите участника, который нравится больше. После выбора появится
            новая пара.
          </p>
        </header>

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
        ) : profiles.length < 2 ? (
          <div className="flex flex-1 items-center justify-center text-center text-gray-600 dark:text-gray-400">
            Новых участников для баттла пока нет. Загляните позже!
          </div>
        ) : (
          <div className="relative flex flex-1 items-stretch">
            <div className="grid w-full gap-4 md:grid-cols-2">
              {profiles.slice(0, 2).map((profile) => (
                <BattleProfileCard
                  key={profile?.id}
                  profile={profile}
                  disabled={isUpdating}
                  onSelect={() => handleWinnerSelect(profile?.id)}
                />
              ))}
            </div>

            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-black/40">
                <Spinner size="md" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
