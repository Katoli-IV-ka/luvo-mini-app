import { useRef, useState } from "react";
import { useLikes, useMatches } from "@/api/likes";
import { MetchModal, LikesCard, MetchesList, Spinner } from "@/components";

export const LikesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const touchEndX = useRef(null);
  const touchStartX = useRef(null);

  const { data: likesData, isLoading: likesIsLoading } = useLikes();
  const { data: metchesData, isLoading: metchesIsLoading } = useMatches();

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

  const onCloseModal = () => setIsOpen(false);

  if (likesIsLoading || metchesIsLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasLikes = likesData && likesData.length > 0;
  const hasMatches = metchesData && metchesData.length > 0;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        {!hasLikes && !hasMatches ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Пока ничего нет
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Лайки и взаимные симпатии появятся здесь, когда вы начнете
              получать внимание
            </p>
          </div>
        ) : (
          <>
            {hasLikes && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Лайки ({likesData.length})
                </h2>

                <div>
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
              </div>
            )}

            {hasMatches && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Взаимные симпатии ({metchesData.length})
                </h2>

                <MetchesList metches={metchesData} />
              </div>
            )}
          </>
        )}
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
