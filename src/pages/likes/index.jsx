import { useRef, useState } from "react";
import { useLikes, useMatches } from "@/api/likes";
import { MetchModal, LikesCard, MetchesList } from "@/components";

export const LikesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const touchEndX = useRef(null);
  const touchStartX = useRef(null);

  const { data: likesData, isLoading: likesIsLoading } = useLikes();
  const { data: metchesData, likesIsLoading: metchesIsLoading } = useMatches();

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

  if (likesIsLoading || metchesIsLoading) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        {likesData.length >= 1 ? (
          <div classNames="mb-10">
            <div
              className="relative"
              onTouchEnd={handleTouchEnd}
              onTouchStart={handleTouchStart}
            >
              <LikesCard card={likesData[currentCardIndex]} />
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {likesData.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCardIndex
                      ? "bg-primary-red"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center">У вас нет лайков</p>
          </div>
        )}

        {metchesData.length >= 1 ? (
          <MetchesList metches={metchesData} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center">У вас нет метчей</p>
          </div>
        )}
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
