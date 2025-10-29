import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components";
import { axiosInstance } from "@/utils/axios.util";

const BATTLE_ENDPOINT = "/battle/pair";

const ProfileCard = ({ profile, onVote, disabled }) => {
  const photo = profile.photos?.[0] || null;

  return (
    <button
      type="button"
      onClick={() => onVote(profile.id)}
      disabled={disabled}
      className="w-full max-w-sm mx-auto flex flex-col gap-3 focus:outline-none disabled:opacity-70"
    >
      <div className="relative w-full overflow-hidden rounded-[24px] aspect-[3/4] bg-gray-200 dark:bg-gray-800">
        {photo ? (
          <img
            src={photo}
            alt={profile.instagram_username || "profile"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Фото отсутствует
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <span className="block text-center text-white text-lg font-semibold truncate">
            @{profile.instagram_username || "username"}
          </span>
        </div>
      </div>
    </button>
  );
};

export const DuelsPage = () => {
  const [pair, setPair] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPair = useCallback(async (winnerId) => {
    try {
      setError(null);
      if (winnerId) {
        setIsVoting(true);
      } else {
        setIsLoading(true);
      }

      const params = winnerId ? { winner_id: winnerId } : undefined;
      const { data } = await axiosInstance.get(BATTLE_ENDPOINT, {
        params,
      });

      setPair(data);
    } catch (err) {
      const fallbackMessage =
        "Не удалось загрузить дуэль. Попробуйте ещё раз позже.";
      const responseMessage =
        err?.response?.data?.detail || err?.message || fallbackMessage;
      setError(responseMessage);
    } finally {
      if (winnerId) {
        setIsVoting(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPair();
  }, [fetchPair]);

  const profiles = useMemo(() => pair?.profiles || [], [pair]);

  const handleVote = useCallback(
    async (profileId) => {
      if (isVoting) return;
      await fetchPair(profileId);
    },
    [fetchPair, isVoting]
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-5">
        <div className="max-w-sm text-center space-y-4">
          <p className="text-base text-gray-600 dark:text-gray-300">{error}</p>
          <button
            type="button"
            onClick={() => fetchPair()}
            className="w-full rounded-xl bg-primary-red text-white py-3 font-semibold"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-5">
        <div className="max-w-sm text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Дуэли скоро начнутся
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Подождите немного, чтобы увидеть новые пары.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] p-5 flex flex-col items-center gap-6">
      <div className="w-full flex flex-col gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onVote={handleVote}
            disabled={isVoting}
          />
        ))}
      </div>

      {isVoting && (
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Spinner size="sm" />
          <span>Загружаем следующую дуэль...</span>
        </div>
      )}
    </div>
  );
};
