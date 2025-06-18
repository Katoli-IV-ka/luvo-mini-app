import { useState } from "react";
import { MetchModal, FeedCard, LikesList } from "@/components";

import LikesImage from "./likes.png";

export const LikesPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLiked = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <FeedCard
          card={{
            age: 16,
            name: "Диана",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
            image: `${LikesImage}`,
          }}
          onClick={handleLiked}
        />

        <LikesList
          likes={[
            { name: "Диана", image: `${LikesImage}` },
            { name: "Диана", image: `${LikesImage}` },
            { name: "Диана", image: `${LikesImage}` },
            { name: "Диана", image: `${LikesImage}` },
            { name: "Диана", image: `${LikesImage}` },
          ]}
        />
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
