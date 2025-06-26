import { useRef } from "react";
import { useCreateProfilePhotos } from "@/api/profile";

import CameraIcon from "./camera.svg";

export const AddPhotoBlock = () => {
  const inputRef = useRef(null);

  const { mutateAsync: addPhotoMutation } = useCreateProfilePhotos();

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const onUploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      console.log(formData, file);

      await addPhotoMutation(formData);
    } catch (e) {
      console.error("Ошибка при загрузке фото:", e);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <div
        onClick={triggerUpload}
        className="w-full aspect-square mx-auto flex items-center justify-center border border-primary-gray/70 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-[20px] cursor-pointer"
      >
        <img src={CameraIcon} alt="camera-icon" className="size-10" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUploadPhoto}
      />
    </>
  );
};
