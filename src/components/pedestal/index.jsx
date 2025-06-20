import HeartIcon from "./heart.svg";
import PedestalImage from "./pedestal.png";

export const Pedestal = ({ data }) => {
  const topFirst = data[0];
  const topSecond = data[1];
  const topThird = data[2];

  return (
    <div className="mt-10 grid grid-cols-3 items-center">
      <div className="flex flex-col items-center">
        <img
          src={
            topSecond.photos && topSecond.photos[0]
              ? topSecond.photos[0]
              : PedestalImage
          }
          alt="rating-image"
          className="size-[70px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-base">
          {topSecond.instagram_username}
        </h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-lg">{topSecond.likes_count}</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-5" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-[#F7FAFF] border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          2
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={
            topFirst.photos && topFirst.photos[0]
              ? topFirst.photos[0]
              : PedestalImage
          }
          alt="rating-image"
          className="size-[100px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-lg">
          {topFirst.instagram_username}
        </h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-2xl">{topFirst.likes_count}</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-7" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-primary-yellow border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          1
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={
            topThird.photos && topThird.photos[0]
              ? topThird.photos[0]
              : PedestalImage
          }
          alt="rating-image"
          className="size-[70px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-base">
          {topThird.instagram_username}
        </h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-lg">{topThird.likes_count}</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-5" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-orange-light border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          3
        </div>
      </div>
    </div>
  );
};
