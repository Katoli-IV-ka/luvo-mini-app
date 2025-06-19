import HeartIcon from "./heart.svg";
import RatingImage from "./rating.png";

export const RatingList = ({ data }) => {
  return (
    <div className="mt-10 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="mt-3 first:mt-0 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center bg-[#F7FAFF] border-2 border-primary-gray/30 font-bold text-black rounded-xl">
              {index + 1}
            </div>

            <img
              src={RatingImage}
              alt="rating-image"
              className="ml-2 size-[60px] object-cover rounded-full"
            />

            <h4 className="ml-2 font-bold text-base">{item.name}</h4>
          </div>

          <div className="flex items-center">
            <h2 className="font-bold text-lg">{item.likesAmount}</h2>

            <img src={HeartIcon} alt="heart-icon" className="ml-2 size-5" />
          </div>
        </div>
      ))}
    </div>
  );
};
