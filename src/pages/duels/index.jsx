import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components";
import { API_URL } from "@/constants";
import { axiosInstance } from "@/utils/axios.util";

const Stage = {
  PAIR: 1,
  LIMIT: 2,
  WINNER: 3,
};

const getNextMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + diff);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
};

const padTime = (value) => value.toString().padStart(2, "0");

const CountdownTimer = ({ targetDate, seconds, onComplete }) => {
  const [target, setTarget] = useState(() => {
    if (targetDate) {
      const parsed = new Date(targetDate).getTime();
      return Number.isNaN(parsed) ? null : parsed;
    }
    if (typeof seconds === "number") {
      return Date.now() + seconds * 1000;
    }
    return null;
  });
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (targetDate) {
      const parsed = new Date(targetDate).getTime();
      setTarget(Number.isNaN(parsed) ? null : parsed);
    } else if (typeof seconds === "number") {
      setTarget(Date.now() + seconds * 1000);
    } else {
      setTarget(null);
    }
  }, [targetDate, seconds]);

  useEffect(() => {
    if (!target) return undefined;

    const updateTimer = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        onComplete?.();
        return false;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: padTime(hours),
        minutes: padTime(minutes),
        seconds: padTime(secondsLeft),
      });
      return true;
    };

    updateTimer();
    const interval = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [target, onComplete]);

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {["hours", "minutes", "seconds"].map((key) => (
        <div key={key} className="text-center">
          <div className="text-3xl font-semibold text-primary-red bg-white rounded-2xl px-5 py-3 min-w-[88px] shadow-[0_18px_35px_rgba(251,63,102,0.15)]">
            {timeLeft[key]}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
            {key === "hours" ? "ч" : key === "minutes" ? "м" : "с"}
          </div>
        </div>
      ))}
    </div>
  );
};

const formatInstagram = (username) => {
  if (!username) return "Instagram не указан";
  const trimmed = username.trim();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

const LimitOverlay = ({ targetDate, seconds, message }) => (
  <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
    <div className="w-full max-w-sm bg-white rounded-[32px] px-6 py-7 text-center shadow-[0_30px_60px_rgba(15,23,42,0.2)]">
      <h2 className="text-lg font-semibold text-gray-900">
        {message || "Ты достиг лимита сравнений 😌"}
      </h2>
      <CountdownTimer targetDate={targetDate} seconds={seconds} />
      <p className="mt-5 text-sm text-gray-500">
        Сегодня вы встретились, а завтра всё может измениться 👋
      </p>
    </div>
  </div>
);

const HowItWorksModal = ({ onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
    <div className="w-full max-w-sm bg-white rounded-[28px] px-6 py-7 text-center shadow-[0_25px_45px_rgba(15,23,42,0.18)]">
      <h2 className="text-lg font-semibold text-gray-900">
        Как работает дуэль?
      </h2>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        Нас пускают по внешности? Нет.
        <br /> Будут ли нас судить по внешности? Да 👋
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full py-3 rounded-full bg-primary-red text-white font-semibold shadow-[0_12px_32px_rgba(251,63,102,0.35)]"
      >
        Ок
      </button>
    </div>
  </div>
);

const WinnerOverlay = ({ profile, onClose }) => {
  const username = formatInstagram(profile?.instagram_username);
  const photo = profile?.photos?.[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-white rounded-[32px] px-6 py-7 text-center shadow-[0_35px_65px_rgba(15,23,42,0.24)]">
        <h2 className="text-lg font-semibold text-gray-900">
          Победитель дуэли 🎉
        </h2>
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="w-40 h-56 rounded-[28px] overflow-hidden shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
            {photo ? (
              <img
                src={photo}
                alt={username}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm">
                Фото отсутствует
              </div>
            )}
          </div>
          <div className="text-base font-semibold text-gray-900">{username}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-full bg-primary-red text-white font-semibold shadow-[0_15px_35px_rgba(251,63,102,0.4)] active:scale-[0.98] transition"
        >
          Завершить дуэль
        </button>
      </div>
    </div>
  );
};

const DuelProfileCard = ({ profile, onSelect, disabled }) => {
  const username = formatInstagram(profile?.instagram_username);
  const photo = profile?.photos?.[0] || null;

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      disabled={disabled}
      className="relative block w-full overflow-hidden rounded-[36px] aspect-[3/4] shadow-[0_25px_45px_rgba(15,23,42,0.22)] active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {photo ? (
        <img
          src={photo}
          alt={username}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 text-gray-500 flex items-center justify-center">
          Фото отсутствует
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="text-lg font-semibold text-white">{username}</div>
      </div>
    </button>
  );
};

const extractNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export const DuelsPage = () => {
  const [duelData, setDuelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerProfile, setWinnerProfile] = useState(null);
  const lastVotedProfileRef = useRef(null);

  const loadPair = useCallback(
    async ({ winnerId, selectedProfile } = {}) => {
      if (winnerId) {
        setIsVoting(true);
      } else {
        setIsLoading(true);
      }

      try {
        const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
          params: winnerId ? { winner_id: winnerId } : undefined,
        });

        const profiles = Array.isArray(data?.profiles) ? data.profiles : [];
        const hasPair = profiles.length >= 2;

        const progressCompleted =
          extractNumber(data?.comparisons_completed) ??
          extractNumber(data?.completed) ??
          extractNumber(data?.current) ??
          extractNumber(data?.progress?.current) ??
          extractNumber(data?.stats?.current);

        const progressTotal =
          extractNumber(data?.comparisons_limit) ??
          extractNumber(data?.limit) ??
          extractNumber(data?.total) ??
          extractNumber(data?.progress?.total) ??
          extractNumber(data?.stats?.total);

        const nextResetAt =
          data?.next_reset_at ||
          data?.limit_reset_at ||
          data?.reset_at ||
          data?.next_duel_at ||
          null;

        const nextResetSeconds =
          extractNumber(data?.next_reset_seconds) ??
          extractNumber(data?.reset_in);

        const winnerFromResponse =
          data?.winner ||
          data?.winner_profile ||
          (data?.winner_id
            ? [...profiles, selectedProfile, lastVotedProfileRef.current]
                .filter(Boolean)
                .find(
                (profile) => profile?.id === data.winner_id
              )
            : null);

        setDuelData({
          stage: data?.stage,
          profiles,
          message: data?.message || data?.limit_message || null,
          nextResetAt,
          nextResetSeconds,
          progress: {
            completed: progressCompleted,
            total: progressTotal,
          },
        });

        if (winnerId) {
          if (!hasPair && data?.stage && data.stage !== Stage.PAIR) {
            const profileForWinner =
              winnerFromResponse || selectedProfile || lastVotedProfileRef.current || null;
            setWinnerProfile(profileForWinner);
            setShowWinnerModal(Boolean(profileForWinner));
          } else {
            setWinnerProfile(null);
            setShowWinnerModal(false);
          }
        } else if (data?.stage === Stage.WINNER && winnerFromResponse) {
          setWinnerProfile(winnerFromResponse);
          setShowWinnerModal(true);
        } else {
          setWinnerProfile(null);
          setShowWinnerModal(false);
        }

        if (hasPair && data?.stage === Stage.PAIR) {
          lastVotedProfileRef.current = null;
        }

        setError(null);
      } catch (err) {
        const detail =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Не удалось загрузить дуэли";
        setError(detail);
      } finally {
        if (winnerId) {
          setIsVoting(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadPair();
  }, [loadPair]);

  const handleSelectWinner = (profile) => {
    if (!profile || isVoting) return;
    lastVotedProfileRef.current = profile;
    loadPair({ winnerId: profile.id, selectedProfile: profile });
  };

  const handleCloseWinner = () => {
    setShowWinnerModal(false);
    setWinnerProfile(null);
    lastVotedProfileRef.current = null;
  };

  const stage = duelData?.stage;
  const profiles = duelData?.profiles || [];
  const hasPair = stage === Stage.PAIR && profiles.length >= 2;
  const shouldShowLimit =
    !hasPair &&
    (stage === Stage.LIMIT ||
      stage === Stage.WINNER ||
      profiles.length < 2);

  const limitTargetDate = useMemo(() => {
    if (!duelData) return null;
    if (duelData.nextResetAt) return duelData.nextResetAt;
    if (
      typeof duelData.nextResetSeconds === "number" &&
      !Number.isNaN(duelData.nextResetSeconds)
    ) {
      return new Date(Date.now() + duelData.nextResetSeconds * 1000);
    }
    if (shouldShowLimit) {
      return getNextMonday();
    }
    return null;
  }, [duelData, shouldShowLimit]);

  const limitSeconds = useMemo(() => {
    if (
      typeof duelData?.nextResetSeconds === "number" &&
      !Number.isNaN(duelData.nextResetSeconds)
    ) {
      return duelData.nextResetSeconds;
    }
    return null;
  }, [duelData]);

  const progressLabel = useMemo(() => {
    const completed = duelData?.progress?.completed;
    const total = duelData?.progress?.total;

    if (completed != null && total != null) {
      return `${completed} из ${total} сравнений`;
    }
    if (completed != null) {
      return `${completed} сравнений`;
    }
    if (total != null) {
      return `0 из ${total} сравнений`;
    }
    return "";
  }, [duelData]);

  if (isLoading && !duelData) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-169px)] px-5 pb-8 pt-6 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center text-sm text-gray-500">
        {progressLabel || "Дуэли"}
      </div>

      {error && (
        <div className="mt-4 text-center text-sm text-red-500">{error}</div>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {hasPair ? (
          profiles.slice(0, 2).map((profile) => (
            <DuelProfileCard
              key={profile?.id || profile?.telegram_user_id}
              profile={profile}
              onSelect={handleSelectWinner}
              disabled={isVoting}
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center text-center text-gray-500 py-16">
            {!shouldShowLimit && (
              <p className="text-sm">
                Сейчас нет активных дуэлей. Попробуйте позже.
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowHowItWorks(true)}
        className="mt-10 text-sm font-semibold text-primary-red"
      >
        Как это работает?
      </button>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}

      {showWinnerModal && winnerProfile && (
        <WinnerOverlay profile={winnerProfile} onClose={handleCloseWinner} />
      )}

      {shouldShowLimit && (
        <LimitOverlay
          targetDate={limitTargetDate}
          seconds={limitSeconds ?? undefined}
          message={duelData?.message}
        />
      )}

      {isVoting && hasPair && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};
