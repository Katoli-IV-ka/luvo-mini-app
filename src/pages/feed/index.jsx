import { useState } from "react";
import { MetchModal } from "@/components";

import FeedImage from "./feed.png";
import HeartIcon from "./heart.svg";

export const FeedPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleLiked = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-md p-5">
        <div className="relative w-full rounded-[20px]">
          <img src={FeedImage} alt="feed-image" className="rounded-[20px]" />

          <div className="absolute top-0 left-0 w-full h-full pt-2 px-3 pb-8 flex flex-col justify-between bg-gradient-to-t from-[#56484E] to-[#56484E]/0 rounded-[20px]">
            <div className="flex justify-between gap-1">
              <div className="w-full h-1 bg-primary-red rounded"></div>
              <div className="w-full h-1 bg-white/70 rounded"></div>
              <div className="w-full h-1 bg-white/70 rounded"></div>
              <div className="w-full h-1 bg-white/70 rounded"></div>
              <div className="w-full h-1 bg-white/70 rounded"></div>
              <div className="w-full h-1 bg-white/70 rounded"></div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl">Владимир, 18</h2>

                <img
                  src={HeartIcon}
                  alt="heart-icon"
                  className="cursor-pointer"
                  onClick={handleLiked}
                />
              </div>

              <div className="mt-3 text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};
