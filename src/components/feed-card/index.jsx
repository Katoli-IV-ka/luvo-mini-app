import classnames from "classnames";

import HeartIcon from "./heart.svg";

// card = {name, age, desc, image}
export const FeedCard = ({ card, onClick, className }) => {
  return (
    <div className={classnames(className, "relative w-full rounded-[20px]")}>
      <img src={card.image} alt="feed-image" className="rounded-[20px]" />

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
            <h2 className="font-bold text-2xl">
              {card.name}, {card.age}
            </h2>

            <img
              src={HeartIcon}
              alt="heart-icon"
              className="cursor-pointer"
              onClick={onClick}
            />
          </div>

          <div className="mt-3 text-base">{card.desc}</div>
        </div>
      </div>
    </div>
  );
};
