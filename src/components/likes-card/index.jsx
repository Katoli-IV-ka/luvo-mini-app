import classnames from "classnames";
import { useIgnored, useLiked } from "@/api/feed";

import CrossIcon from "./cross.svg";
import HeartIcon from "./heart.svg";

// card = {name, age, desc, image}
export const LikesCard = ({ card, onClick, className }) => {
  const { mutate: likeUser } = useLiked();
  const { mutate: ignoreUser } = useIgnored();

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);

    let age = today.getFullYear() - birthDate.getFullYear();

    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!isBirthdayPassed) {
      age -= 1;
    }

    return age;
  };

  const handleLike = (id) => {
    likeUser(id, {
      onSuccess: () => {
        onActionEnd?.(); // например, убрать карточку или показать следующую
      },
    });
  };

  const handleIgnore = (id) => {
    ignoreUser(id, {
      onSuccess: () => {
        onActionEnd?.();
      },
    });
  };

  return (
    <div
      className={classnames(
        className,
        "relative w-full max-h-[500px] h-full rounded-[20px] text-white"
      )}
    >
      <img
        src={card.photos[0]}
        alt="feed-image"
        className="max-h-[500px] h-full w-full object-cover rounded-[20px]"
      />

      <div
        className={classnames(
          "absolute top-0 left-0 w-full h-full max-h-[500px] pt-2 px-3 pb-8 flex flex-col justify-between rounded-[20px]",
          { "bg-gradient-to-t from-[#56484E] to-[#56484E]/0": onClick }
        )}
      >
        <div className="flex justify-between gap-1">
          {card.photos.length >= 2 &&
            card.photos.map((_, index) => (
              <div
                key={index}
                className={classnames(
                  "w-full h-1 bg-white/70 rounded first:bg-primary-red",
                  {
                    // 'bg-primary-red': photo === true
                  }
                )}
              ></div>
            ))}
        </div>

        {onClick && (
          <div>
            <div>
              <h2 className="font-bold text-2xl">
                {card.instagram_username}, {calculateAge(card.birthdate)}
              </h2>

              {card.about && <div className="mt-3 text-base">{card.about}</div>}
            </div>

            <div className="mt-4 px-5 flex items-center justify-between">
              <img
                src={CrossIcon}
                alt="cross-icon"
                className="size-8 cursor-pointer"
                onClick={() => handleIgnore(card.id)}
              />

              <img
                src={HeartIcon}
                alt="heart-icon"
                className="size-8 cursor-pointer"
                onClick={() => handleLike(card.id)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
