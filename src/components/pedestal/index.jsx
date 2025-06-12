import HeartIcon from "./heart.svg";
import PedestalImage from "./pedestal.png";

export const Pedestal = () => {
  return (
    <div className="mt-10 grid grid-cols-3 items-center">
      <div className="flex flex-col items-center">
        <img
          src={PedestalImage}
          alt="rating-image"
          className="size-[70px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-base text-black">Александра</h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-lg text-black">2,8k</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-5" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-[#F7FAFF] border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          2
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={PedestalImage}
          alt="rating-image"
          className="size-[100px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-lg text-black">Александра</h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-2xl text-black">3,2k</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-7" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-primary-yellow border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          1
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={PedestalImage}
          alt="rating-image"
          className="size-[70px] object-cover rounded-full"
        />

        <h4 className="mt-1 font-bold text-base text-black">Александра</h4>

        <div className="mt-1 flex items-center">
          <h2 className="font-bold text-lg text-black">1,4k</h2>

          <img src={HeartIcon} alt="heart-icon" className="size-5" />
        </div>

        <div className="mt-1 h-10 w-10 flex items-center justify-center bg-orange-light border-2 border-primary-gray/30 font-bold text-black rounded-xl">
          3
        </div>
      </div>
    </div>
  );
};
