import { useEffect } from "react";
import { useWebAppStore } from "@/store";

import SpinnerIcon from "./spinner.svg";

export const LoadingPage = () => {
  const { init, error } = useWebAppStore();

  useEffect(() => {
    init();
  }, [init]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-center">Ошибка загрузки: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <img src={SpinnerIcon} alt="spinner-icon" className="animate-spin" />
    </div>
  );
};
