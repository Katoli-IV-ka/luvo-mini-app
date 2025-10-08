import React, { useEffect } from "react";
import { useDuelProgressStore } from "@/store/duelProgressStore";

export const DuelProgressBar = () => {
  const { total, current, refreshFromStorage } = useDuelProgressStore();
  const progress = Math.min((current / total) * 100, 100);

  useEffect(() => {
    // make sure store is synced on mount
    refreshFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full px-6 py-2">
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
      </div>
    </div>
  );
};
