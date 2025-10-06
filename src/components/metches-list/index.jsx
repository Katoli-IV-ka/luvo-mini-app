import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// Кэш для низкокачественных изображений
const lowQualityCache = new Map();
const imagePreloadCache = new Set();

// Утилиты для оптимизации изображений
const createOptimizedImageUrl = (src, width = 400, quality = 80) => {
  // Если это внешний URL, возвращаем как есть (можно добавить параметры для CDN)
  if (src.startsWith("http")) {
    return src;
  }

  // Для локальных изображений можно добавить параметры оптимизации
  return src;
};

const createLowQualityImage = (src) => {
  // Проверяем кэш
  if (lowQualityCache.has(src)) {
    return Promise.resolve(lowQualityCache.get(src));
  }

  return new Promise((resolve) => {
    // Проверяем, не загружается ли уже это изображение
    if (imagePreloadCache.has(src)) {
      // Ждем завершения загрузки
      const checkLoaded = () => {
        if (lowQualityCache.has(src)) {
          resolve(lowQualityCache.get(src));
        } else {
          setTimeout(checkLoaded, 50);
        }
      };
      checkLoaded();
      return;
    }

    imagePreloadCache.add(src);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      try {
        // Устанавливаем маленький размер для blur эффекта
        canvas.width = 20;
        canvas.height = 20;

        // Рисуем размытое изображение
        ctx.drawImage(img, 0, 0, 20, 20);

        // Получаем data URL с оптимизацией
        const lowQualitySrc = canvas.toDataURL("image/webp", 0.1);

        // Кэшируем результат
        lowQualityCache.set(src, lowQualitySrc);
        resolve(lowQualitySrc);
      } catch (error) {
        console.warn("Error creating low quality image:", error);
        resolve(null);
      } finally {
        imagePreloadCache.delete(src);
      }
    };

    img.onerror = () => {
      imagePreloadCache.delete(src);
      resolve(null);
    };

    // Устанавливаем CORS для внешних изображений
    img.crossOrigin = "anonymous";
    img.src = src;
  });
};

const MetchItem = ({ metch }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualitySrc, setLowQualitySrc] = useState(null);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Callback для обработки загрузки изображения
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Изображение попало в область видимости
            if (metch.photos?.[0] && !lowQualitySrc) {
              createLowQualityImage(metch.photos[0]).then(setLowQualitySrc);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Начинаем загрузку за 50px до появления
        threshold: 0.1,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [metch.photos, lowQualitySrc]);

  return (
    <Link to={`/other-profile/${metch.id}?isMetch=true`}>
      <div
        ref={imgRef}
        className="relative aspect-square rounded-[20px] mb-[5px] overflow-hidden bg-gray-300"
      >
        {/* Низкокачественное изображение как placeholder */}
        {lowQualitySrc && !imageLoaded && !imageError && (
          <img
            src={lowQualitySrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[20px] filter blur-sm scale-110"
            style={{ imageRendering: "pixelated" }}
            loading="eager" // Загружаем placeholder сразу
          />
        )}

        {/* Полноценное изображение */}
        {metch.photos?.[0] && !imageError && (
          <img
            src={createOptimizedImageUrl(metch.photos[0])}
            alt={`${metch.instagram_username} profile`}
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover rounded-[20px] transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            // Оптимизация для мобильных устройств
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Ошибка загрузки изображения */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-sm text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2"></div>
              <span>Фото недоступно</span>
            </div>
          </div>
        )}

        {/* Fallback для случаев когда нет изображения */}
        {!metch.photos?.[0] && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-sm text-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-2"></div>
              <span>Нет фото</span>
            </div>
          </div>
        )}

        {/* Индикатор загрузки */}
        {!imageLoaded && !imageError && metch.photos?.[0] && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div
        className="mt-[5px] font-bold text-xl truncate"
        title={metch.instagram_username}
      >
        {metch.instagram_username}
      </div>
    </Link>
  );
};

export const MetchesList = ({ metches }) => {
  if (!metches || metches.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {metches.map((metch, index) => (
        <MetchItem key={index} metch={metch} />
      ))}
    </div>
  );
};
