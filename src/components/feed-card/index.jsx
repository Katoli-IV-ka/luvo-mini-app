import { useState, useRef, useEffect, useCallback } from "react";
import classnames from "classnames";
import { useLiked, useFeedView } from "@/api/feed";

import BigHeart from "../../assets/icons/big-heart.svg";
import HeartIcon from "./heart.svg";
import EmptyHeartIcon from "./empty-heart.svg";

const DOUBLE_TAP_DELAY = 250;

export const FeedCard = ({ card, viewed, setViewed, className, setIsOpen }) => {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const lastTap = useRef(0);
  const clickTimeout = useRef(null);

  const { mutate: sendViewMutation } = useFeedView();
  const { mutateAsync: likeUserMutation } = useLiked();

  const markAsViewed = useCallback(() => {
    if (!viewed) {
      sendViewMutation(card.user_id);
      setViewed(true);
    }
  }, [viewed, sendViewMutation, card.user_id, setViewed]);

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    setHeartAnim(true);
    setTimeout(() => {
      setHeartAnim(false);
      setShowHeart(false);
    }, 1200);
  };

  const triggerUnlikeAnimation = () => {
    // Можно добавить анимацию для отмены лайка, если нужно
    // Пока просто обновляем состояние
  };

  const handleLike = async () => {
    markAsViewed();

    try {
      const { data } = await likeUserMutation(card.user_id);

      if (liked) {
        // Отменяем лайк
        setLiked(false);
        triggerUnlikeAnimation();
      } else {
        // Ставим лайк
        if (data.matched) {
          setIsOpen(true);
        }
        setLiked(true);
        triggerHeartAnimation();
      }
    } catch (error) {
      console.error("Ошибка лайка:", error);
    }
  };

  const handleSingleTap = (clickX, containerWidth) => {
    setCurrentPhotoIndex((prev) => {
      const isLeft = clickX < containerWidth / 2;
      return isLeft
        ? prev === 0
          ? card.photos.length - 1
          : prev - 1
        : prev === card.photos.length - 1
        ? 0
        : prev + 1;
    });
  };

  const handleImageClick = (e) => {
    markAsViewed();

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      handleLike();
    } else {
      clickTimeout.current = setTimeout(() => {
        handleSingleTap(clickX, rect.width);
        clickTimeout.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      handleLike();
    }
    lastTap.current = now;
  };

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    return birthdayPassed ? age : age - 1;
  };

  useEffect(() => {
    if (!card.photos || card.photos.length === 0) return;

    card.photos.forEach((url, index) => {
      if (index === currentPhotoIndex) return; // текущая уже отображается

      const img = new Image();
      img.src = url;
    });

    setLiked(false);
    setCurrentPhotoIndex(0);
    clickTimeout.current && clearTimeout(clickTimeout.current);
  }, [card.user_id]);

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
          alt="profile"
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
            />
          ))}
        </div>

        <div>
          <div className="pr-3 flex items-center justify-between">
            <h2 className="font-bold text-2xl">
              {card.first_name}, {calculateAge(card.birthdate)}
            </h2>
            <img
              src={liked ? HeartIcon : EmptyHeartIcon}
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
