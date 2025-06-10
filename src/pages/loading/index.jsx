import { useEffect } from "react";
import { useWebAppStore } from "@/store";

export const LoadingPage = () => {
  const { init, error } = useWebAppStore();

  useEffect(() => {
    init();
  }, [init]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-red-600 text-center">Ошибка загрузки: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
    </div>
  );
};
