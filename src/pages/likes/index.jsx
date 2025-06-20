import { useState } from "react";
import { MetchModal, LikesCard, LikesList } from "@/components";

const data = [
  {
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    latitude: 0,
    longitude: 0,
    id: 0,
    user_id: 0,
    telegram_username: "string",
    instagram_username: "string",
    photos: ["https://picsum.photos/300", "https://picsum.photos/300"],
    created_at: "2025-06-20T05:42:36.694Z",
  },
  {
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    latitude: 0,
    longitude: 0,
    id: 1,
    user_id: 0,
    telegram_username: "string",
    instagram_username: "dfsf",
    photos: ["https://picsum.photos/300", "https://picsum.photos/300"],
    created_at: "2025-06-20T05:42:36.694Z",
  },
  {
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    latitude: 0,
    longitude: 0,
    id: 2,
    user_id: 0,
    telegram_username: "string",
    instagram_username: "232",
    photos: ["https://picsum.photos/300", "https://picsum.photos/300"],
    created_at: "2025-06-20T05:42:36.694Z",
  },
];

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
        <LikesCard card={data[0]} onClick={handleLiked} />

        <LikesList data={data} />
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
