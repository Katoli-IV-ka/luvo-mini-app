// src/components/DuelProgressBar.jsx
import React, { useEffect, useState } from "react";
import {
  useDuelProgressStore,
  DUEL_LIMIT_KEY,
} from "@/store/duelProgressStore";

const formatRemaining = (ms) => {
  if (!ms || ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const DuelProgressBar = () => {
  const { total, current, limitUntil, isBlocked, refreshFromStorage } =
    useDuelProgressStore();
  const progress = Math.min((current / total) * 100, 100);
  const [remaining, setRemaining] = useState(
    limitUntil ? Math.max(limitUntil - Date.now(), 0) : 0
  );

  useEffect(() => {
    // make sure store is synced on mount
    refreshFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isBlocked) {
      setRemaining(0);
      return;
    }
    // sync local remaining from localStorage value (other tabs may change)
    const tick = () => {
      const until = parseInt(localStorage.getItem(DUEL_LIMIT_KEY) || "0", 10);
      const now = Date.now();
      const diff = Math.max(until - now, 0);
      setRemaining(diff);
      if (diff <= 0) {
        // refresh store when expired
        useDuelProgressStore.getState().refreshFromStorage();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isBlocked]);

  return (
    <div className="w-full px-6 mb-2">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary-red h-2.5 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <div>
          <strong className="text-gray-800 dark:text-gray-200">
            {current}
          </strong>{" "}
          из {total} сравнений
        </div>

        {isBlocked ? (
          <div className="text-red-600 font-medium">
            Лимит на сегодня — доступно через {formatRemaining(remaining)}
          </div>
        ) : (
          <div className="text-gray-400">
            До лимита осталось {total - current}
          </div>
        )}
      </div>
    </div>
  );
};
