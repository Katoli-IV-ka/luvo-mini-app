import { useMemo, useState } from "react";
import classnames from "classnames";

export const DuelCard = ({
  user,
  style,
  onSelect,
  disabled = false,
  sizeClass = "aspect-square",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const photoUrl = useMemo(() => {
    const src = Array.isArray(user.photos) ? user.photos[0] : user.photos;
    return typeof src === "string" ? src : "";
  }, [user.photos]);

  const initials = useMemo(() => {
    const name = (user?.instagram_username || "?").trim();
    const parts = name.split(" ");
    const first = parts[0]?.[0] || "?";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [user?.instagram_username]);

  const age = useMemo(() => {
    const bd = user?.birthdate;
    if (!bd) return null;
    const d = new Date(bd);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      years -= 1;
    }
    return years >= 0 ? years : null;
  }, [user?.birthdate]);

  const handleCardClick = () => {
    if (!disabled) {
      onSelect(user.id);
    }
  };

  const getCardClasses = () => {
    return classnames(
      "relative w-full rounded-[20px] text-white overflow-hidden cursor-pointer",
      sizeClass,
      disabled ? "opacity-50 cursor-not-allowed" : ""
    );
  };

  return (
    <div className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className={getCardClasses()} style={style}>
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

          {/* Наложение имени/возраста внизу */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold drop-shadow">
                {user.instagram_username || "Аноним"}
              </h3>
              {age != null && (
                <span className="text-xs sm:text-sm text-white/90">
                  {age} лет
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
