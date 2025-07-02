import { useEffect, useState } from "react";
import { AddPhotoBlock } from "./add-photo-block";
import { useDeleteProfilePhotos } from "@/api/profile";

// import EditIcon from "./edit.svg";
import CloseIcon from "./close.svg";

export const ProfilePhotosList = ({ photos = [] }) => {
  const [genericError, setGenericError] = useState("");

  const safePhotos = Array.isArray(photos) ? photos : [];
  const paddedPhotos = [
    ...safePhotos,
    ...Array(6 - safePhotos.length).fill(null),
  ].slice(0, 6);

  const { mutateAsync: detelePhotoMutation } = useDeleteProfilePhotos();

  const onRemovePhoto = async (id) => {
    try {
      await detelePhotoMutation(id);
    } catch (e) {
      console.error(e);
      setGenericError(e?.response?.data?.detail);
    }
  };

  useEffect(() => {
    if (!genericError) return;

    const timeout = setTimeout(() => {
      setGenericError("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [genericError]);

  return (
    <>
      <h3 className="font-bold text-2xl">Мои фото</h3>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {paddedPhotos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-[20px]">
            {photo ? (
              <>
                <img
                  src={photo.url}
                  alt="likes-image"
                  className="w-full h-full object-cover rounded-[20px]"
                />

                <div className="w-full h-full pb-1.5 absolute top-0 left-0 flex flex-col items-center justify-between bg-gradient-to-t from-[#56484E] to-[#56484E]/0 rounded-[20px]">
                  {index >= 0 && (
                    <img
                      src={CloseIcon}
                      alt="actions-icon"
                      className="ml-auto cursor-pointer"
                      onClick={() => onRemovePhoto(photo.id)}
                    />
                  )}
                  {/* <img src={EditIcon} alt="action-icon" className="ml-auto" /> */}

                  {index == 0 && (
                    <div className="font-bold text-[10px] text-white">
                      Главное фото
                    </div>
                  )}
                </div>
              </>
            ) : (
              <AddPhotoBlock />
            )}
          </div>
        ))}
      </div>

      {genericError && (
        <div className="mt-4 w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl font-semibold text-light-red">
          {genericError}
        </div>
      )}
    </>
  );
};
