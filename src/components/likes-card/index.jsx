import classnames from "classnames";

import CrossIcon from "./cross.svg";
import HeartIcon from "./heart.svg";

// card = {name, age, desc, image}
export const LikesCard = ({ card, onClick, className }) => {
  return (
    <div
      className={classnames(
        className,
        "relative w-full max-h-[500px] h-full rounded-[20px] text-white"
      )}
    >
      <img
        src={card.image}
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
          <div className="w-full h-1 bg-primary-red rounded"></div>
          <div className="w-full h-1 bg-white/70 rounded"></div>
          <div className="w-full h-1 bg-white/70 rounded"></div>
          <div className="w-full h-1 bg-white/70 rounded"></div>
          <div className="w-full h-1 bg-white/70 rounded"></div>
          <div className="w-full h-1 bg-white/70 rounded"></div>
        </div>

        {onClick && (
          <div>
            <div>
              <h2 className="font-bold text-2xl">
                {card.name}, {card.age}
              </h2>

              <div className="mt-3 text-base">{card.desc}</div>
            </div>

            <div className="mt-4 px-5 flex items-center justify-between">
              <img
                src={CrossIcon}
                alt="cross-icon"
                className="size-8 cursor-pointer"
                onClick={onClick}
              />

              <img
                src={HeartIcon}
                alt="heart-icon"
                className="size-8 cursor-pointer"
                onClick={onClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
