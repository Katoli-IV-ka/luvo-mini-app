import { Button } from "@/ui";
import { useNavigate } from "react-router-dom";

import CameraIcon from "./camera.svg";

export const PhotoSelectionPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/feed");
  };

  return (
    <div className="w-full min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-md p-5">
        <h2 className="text-[32px] font-bold text-black">Выберите фото</h2>

        <div className="mt-10 w-full aspect-square mx-auto flex items-center justify-center border-4 border-primary-gray/30 bg-gray-light rounded-[20px]">
          <img src={CameraIcon} alt="camera-icon" className="size-[130px]" />
        </div>

        <Button className="mt-3 w-full" onClick={handleNext}>
          Готово
        </Button>
      </div>
    </div>
  );
};
