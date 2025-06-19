import { useState } from "react";
import { useFeeds } from "@/api/feed";
import { FeedCard, MetchModal } from "@/components";

import FeedImage from "./feed.png";
import { useWebAppStore } from "../../store";

export const FeedPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { theme } = useWebAppStore();
  const { data, isLoading } = useFeeds();

  console.log(theme);

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const handleLiked = () => {
    setIsOpen(true);
  };

  if (isLoading) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center justify-center">
      <div className="container h-full mx-auto max-w-md p-5">
        <FeedCard
          card={{
            age: 18,
            name: "Владимир",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
            image: `${FeedImage}`,
          }}
          onClick={handleLiked}
        />
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
