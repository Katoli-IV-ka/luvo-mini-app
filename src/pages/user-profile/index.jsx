import { ProfilePhotosList } from "@/components";
import { Input, Button, Textarea } from "@/ui";

import LikesImage from "./likes.png";

export const UserProfilePage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-scroll">
        <ProfilePhotosList
          photos={[
            { image: `${LikesImage}` },
            { image: `${LikesImage}` },
            { image: `${LikesImage}` },
            { image: `${LikesImage}` },
          ]}
        />

        <div className="mt-10">
          <h2 className="text-2xl font-bold leading-none text-black">
            Инстаграм
          </h2>

          <Input className="mt-5" placeholder="Intstagram" />
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold text-black">О себе</h2>

          <div className="mt-5">
            <Input placeholder="Имя" />
            <Input className="mt-3" type="number" placeholder="Возраст" />
            <Textarea className="mt-3" placeholder="О себе" />
          </div>

          <Button className="mt-3 w-full">Сохранить</Button>
        </div>
      </div>
    </div>
  );
};
