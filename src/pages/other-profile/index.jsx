import { FeedCard } from "@/components";

import LikesImage from "./likes.png";
import TelegramIcon from "./telegram.png";
import InstragramIcon from "./instagram.png";

export const OtherProfilePage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <FeedCard
          card={{
            age: 16,
            name: "Диана",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
            image: `${LikesImage}`,
          }}
        />

        <div className="mt-10 text-black">
          <h2 className="font-bold text-2xl">Диана, 16</h2>

          <div className="mt-3 text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's
          </div>
        </div>

        <div className="mt-10">
          <div className="flex">
            <img src={InstragramIcon} alt="instagram-icon" className="size-8" />
            <div className="ml-2 font-bold text-black text-2xl">@diana</div>
          </div>

          <div className="mt-3 flex">
            <img src={TelegramIcon} alt="telegram-icon" className="size-8" />
            <div className="ml-2 font-bold text-black text-2xl">@diana</div>
          </div>
        </div>
      </div>
    </div>
  );
};
