import { useState, useRef } from "react";
import classnames from "classnames";
import { useLiked } from "@/api/feed";

import BigHeart from "../../assets/icons/big-heart.svg";
import HeartIcon from "./heart.svg";

export const FeedCard = ({ card, className }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const lastTap = useRef(0);

  const { mutate: likeUser } = useLiked(card.id);

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
    likeUser();

    setShowHeart(true);
    setHeartAnim(true);

    setTimeout(() => {
      setHeartAnim(false);
    }, 1000);

    setTimeout(() => {
      setShowHeart(false);
    }, 1200);
  };

  // Обработчик клика по картинке — листает фото в зависимости от стороны
  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < rect.width / 2) {
      // Клик слева — листаем назад
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex === 0 ? card.photos.length - 1 : prevIndex - 1
      );
    } else {
      // Клик справа — листаем вперёд
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex === card.photos.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Для дабл-тапа лайка по touch
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
        "relative w-full h-full rounded-[20px] text-white overflow-hidden"
      )}
    >
      <div className="relative w-full h-full">
        <img
          src={card.photos[currentPhotoIndex]}
          alt="feed-image"
          className="h-full w-full object-cover rounded-[20px] select-none"
          draggable={false}
        />

        {showHeart && (
          <img
            src={BigHeart}
            alt="big-heart"
            className={classnames(
              "absolute top-1/2 left-1/2 z-20 size-32 -translate-x-1/2 -translate-y-1/2",
              { "animate-like-heart": heartAnim }
            )}
          />
        )}
      </div>

      <div
        className={classnames(
          "absolute top-0 left-0 w-full h-full pt-2 px-3 pb-8 flex flex-col justify-between rounded-[20px]",
          "bg-gradient-to-t from-[#56484E] to-[#56484E]/0"
        )}
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
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
          <div className="pr-3 flex items-center justify-between">
            <h2 className="font-bold text-2xl">
              {card.instagram_username}, {calculateAge(card.birthdate)}
            </h2>

            <img
              src={HeartIcon}
              alt="heart-icon"
              className="size-8 cursor-pointer"
              onClick={handleLike}
            />
          </div>

          {card.about && <p className="mt-3 text-base">{card.about}</p>}
        </div>
      </div>
    </div>
  );
};
