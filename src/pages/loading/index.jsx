import { useEffect } from "react";
import { Spinner } from "@/components";
import { useWebAppStore } from "@/store";

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
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white">
      <Spinner size="xl" />
    </div>
  );
};
