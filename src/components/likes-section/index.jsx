import { useState, useRef } from "react";
import { LikesCard } from "../likes-card";
import { EmptyState } from "../empty-state";

export const LikesSection = ({ likesData, isLoading }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const touchEndX = useRef(null);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      setCurrentCardIndex((prev) =>
        prev < likesData.length - 1 ? prev + 1 : prev
      );
    } else if (diff < -threshold) {
      setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  if (!likesData || likesData.length === 0) {
    return <EmptyState type="likes" />;
  }

  return (
    <div className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Лайки ({likesData.length})
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Люди, которые поставили вам лайк
        </p>
      </div>

      <div
        className="relative"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <LikesCard card={likesData[currentCardIndex]} />
      </div>

      {likesData.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {likesData.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentCardIndex
                  ? "bg-primary-red"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
