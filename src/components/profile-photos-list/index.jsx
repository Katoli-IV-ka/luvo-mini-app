import EditIcon from "./edit.svg";
import CloseIcon from "./close.svg";
import CameraIcon from "./camera.svg";

export const ProfilePhotosList = ({ photos }) => {
  const paddedPhotos = [
    ...photos,
    ...Array(6 - photos.length).fill(null),
  ].slice(0, 6);

  return (
    <>
      <h3 className="font-bold text-2xl">Мои фото</h3>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {paddedPhotos.map((src, index) => (
          <div key={index} className="relative aspect-square rounded-[20px]">
            {src ? (
              <>
                <img
                  src={src}
                  alt="likes-image"
                  className="w-full h-full object-cover rounded-[20px]"
                />

                <div className="w-full h-full pb-1.5 absolute top-0 left-0 flex flex-col items-center justify-between bg-gradient-to-t from-[#56484E] to-[#56484E]/0 rounded-[20px]">
                  <img
                    src={index == 0 ? EditIcon : CloseIcon}
                    alt="action-icon"
                    className="ml-auto"
                  />

                  {index == 0 && (
                    <div className="font-bold text-[10px] text-white">
                      Главное фото
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full aspect-square mx-auto flex items-center justify-center border border-primary-gray/70 dark:border-white/70 dark:transparent bg-gray-light rounded-[20px]">
                <img src={CameraIcon} alt="camera-icon" className="size-10" />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
