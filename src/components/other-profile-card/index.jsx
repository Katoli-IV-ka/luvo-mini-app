import { useState } from "react";
import classnames from "classnames";

export const OtherProfileCard = ({ card, className }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < rect.width / 2) {
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex === 0 ? card.photos.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentPhotoIndex((prevIndex) =>
        prevIndex === card.photos.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div
      className={classnames(
        className,
        "relative w-full max-h-[500px] h-full rounded-[20px] text-white overflow-hidden"
      )}
    >
      <div className="relative w-full h-full">
        <img
          src={card.photos[currentPhotoIndex]}
          alt="feed-image"
          className="h-full w-full object-cover rounded-[20px] select-none"
          draggable={false}
        />
      </div>

      <div
        className={classnames(
          "absolute top-0 left-0 w-full h-full pt-2 px-3 pb-8 flex flex-col justify-between rounded-[20px]"
        )}
        onClick={handleImageClick}
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
      </div>
    </div>
  );
};
