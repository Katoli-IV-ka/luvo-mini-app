import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { useIgnored, useLiked } from "@/api/feed";

import CrossIcon from "./cross.svg";
import HeartIcon from "./heart.svg";
import BigHeart from "../../assets/icons/big-heart.svg";

export const LikesCard = ({ card, className }) => {
  const { mutate: likeUser } = useLiked();
  const { mutate: ignoreUser } = useIgnored();

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  // Для анимации улетающего сердца — контролируем класс
  const [heartAnim, setHeartAnim] = useState(false);

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);

    let age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    return isBirthdayPassed ? age : age - 1;
  };

  const handleLike = () => {
    likeUser(card.id);

    setShowHeart(true);
    setHeartAnim(true);

    // Анимация длится 1000 мс (1 секунда)
    setTimeout(() => {
      setHeartAnim(false);
    }, 1000);

    setTimeout(() => {
      setShowHeart(false);
    }, 1200);
  };

  const handleIgnore = () => {
    ignoreUser(card.id);
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < rect.width / 2) {
      setCurrentPhotoIndex((prev) =>
        prev > 0 ? prev - 1 : card.photos.length - 1
      );
    } else {
      setCurrentPhotoIndex((prev) =>
        prev < card.photos.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleLike();
    }
    lastTap.current = now;
  };

  return (
    <div
      className={classnames(
        className,
        "relative w-full max-h-[500px] h-full rounded-[20px] text-white overflow-hidden"
      )}
    >
      <div
        className="relative w-full h-full"
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
      >
        <img
          src={card.photos[currentPhotoIndex]}
          alt="feed-image"
          className="h-full w-full object-cover rounded-[20px] select-none"
        />

        {showHeart && (
          <img
            src={BigHeart}
            alt="big-heart"
            className={classnames(
              "absolute top-1/2 left-1/2 z-20 size-32 -translate-x-1/2 -translate-y-1/2",
              {
                "animate-like-heart": heartAnim,
              }
            )}
          />
        )}
      </div>

      <div
        className={classnames(
          "absolute top-0 left-0 w-full h-full pt-2 px-3 pb-8 flex flex-col justify-between rounded-[20px]",
          "bg-gradient-to-t from-[#56484E] to-[#56484E]/0"
        )}
      >
        <div className="flex justify-between gap-1">
          {card.photos.map((_, index) => (
            <div
              key={index}
              className={classnames(
                "w-full h-1 rounded",
                index === currentPhotoIndex ? "bg-primary-red" : "bg-white/70"
              )}
            ></div>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-2xl">
            {card.instagram_username}, {calculateAge(card.birthdate)}
          </h2>

          {card.about && <p className="mt-3 text-base">{card.about}</p>}

          <div className="mt-4 px-5 flex items-center justify-between">
            <img
              src={CrossIcon}
              alt="cross-icon"
              className="size-8 cursor-pointer"
              onClick={handleIgnore}
            />

            <img
              src={HeartIcon}
              alt="heart-icon"
              className="size-8 cursor-pointer"
              onClick={handleLike}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
