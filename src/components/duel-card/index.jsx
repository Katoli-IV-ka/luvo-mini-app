import { useMemo, useState } from "react";
import classnames from "classnames";

export const DuelCard = ({
  user,
  isLoser,
  isWinner,
  onSelect,
  isSelected,
  disabled = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const photoUrl = useMemo(() => {
    const src = Array.isArray(user.photos) ? user.photos[0] : user.photos;
    return typeof src === "string" ? src : "";
  }, [user.photos]);

  const initials = useMemo(() => {
    const name = (user?.name || "?").trim();
    const parts = name.split(" ");
    const first = parts[0]?.[0] || "?";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [user?.name]);

  const handleCardClick = () => {
    if (!disabled && !isSelected) {
      onSelect(user.id);
    }
  };

  const getCardClasses = () => {
    return classnames(
      "relative aspect-square w-[45vw] max-w-[360px] sm:w-[42vw] md:w-[38vw] lg:w-[32vw] rounded-[20px] text-white overflow-hidden cursor-pointer transition-all duration-500 ease-out",
      {
        "ring-4 ring-primary-red ring-opacity-80 scale-105 shadow-2xl":
          isSelected,
        "ring-4 ring-green-500 ring-opacity-80 scale-105 shadow-2xl animate-pulse":
          isWinner,
        "ring-4 ring-red-500 ring-opacity-80 scale-95 opacity-75": isLoser,
        "opacity-50 cursor-not-allowed": disabled,
        "hover:scale-105 hover:shadow-xl": !disabled && !isSelected,
      }
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Карточка с фотографией */}
      <div className={getCardClasses()} onClick={handleCardClick}>
        <div className="relative w-full h-full">
          {/* Скелетон */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}

          {/* Fallback, если картинка не загрузилась */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-3xl font-bold text-gray-500 dark:text-gray-300">
                {initials}
              </span>
            </div>
          )}

          {/* Фото */}
          {!!photoUrl && (
            <img
              src={photoUrl}
              alt={`${user.name || "Пользователь"}`}
              className={classnames(
                "h-full w-full object-cover rounded-[20px] select-none transition-opacity duration-300",
                isLoaded && !hasError ? "opacity-100" : "opacity-0"
              )}
              draggable={false}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(true);
              }}
            />
          )}

          {/* Статус выбора поверх картинки */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary-red text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              Выбран
            </div>
          )}

          {isWinner && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              🏆
            </div>
          )}

          {isLoser && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              💔
            </div>
          )}
        </div>
      </div>

      {/* Имя и возраст под карточкой */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {user.name || "Аноним"}
        </h3>
        {user.age && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.age} лет
          </p>
        )}
      </div>
    </div>
  );
};
