import { useState } from "react";
import { useFeeds } from "@/api/feed";
import { FeedCard, MetchModal } from "@/components";

export const FeedPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useFeeds();

  const onCloseModal = () => {
    setIsOpen(false);
  };

  if (isLoading || !data.length) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center justify-center">
      <div className="relative container h-full mx-auto max-w-md p-5 overflow-y-auto">
        {data.map((card) => (
          <FeedCard key={card.id} card={card} />
        ))}
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
