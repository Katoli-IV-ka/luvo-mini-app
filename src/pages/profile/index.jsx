import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfilePhotosList } from "@/components";
import { Input, Button, Textarea } from "@/ui";
import { useProfile, useUpdateProfile, useProfilePhotos } from "@/api/profile";

const schema = yup.object({
  instagram_username: yup.string().required("Введите имя пользователя"),
  first_name: yup.string().required("Имя обязательно"),
  about: yup.string().optional(),
});

export const ProfilePage = () => {
  const { data: photosData, isLoading: photosIsLoading } = useProfilePhotos();
  const { data: profileData, isLoading: profileIsLoading } = useProfile();

  const { mutateAsync } = useUpdateProfile();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      about: "",
      birthdate: "",
      first_name: "",
      instagram_username: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("gender", "male");

      await mutateAsync(formData);

      navigate("/feed");
    } catch (err) {
      console.error("Ошибка регистрации", err);
      setGenericError(err?.response?.data?.detail);
    }
  };

  const handleInitData = async () => {
    const initData = window.Telegram?.WebApp?.initData;

    if (initData) {
      try {
        await navigator.clipboard.writeText(initData);
        window.Telegram.WebApp.showAlert(
          "Держи initData Максик! Данные скопирована в буфер обмена<3"
        );
      } catch (err) {
        console.error("Не удалось скопировать initData:", err);
        window.Telegram.WebApp.showAlert("Ошибка при копировании initData.");
      }
    } else {
      window.Telegram.WebApp.showAlert("initData недоступно.");
    }
  };

  useEffect(() => {
    if (profileData) {
      reset({
        instagram_username: profileData.instagram_username || "",
        first_name: profileData.first_name || "",
        about: profileData.about || "",
        birthdate: profileData.birthdate || "",
      });
    }
  }, [profileData, reset]);

  if (profileIsLoading || photosIsLoading) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <form
        className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfilePhotosList photos={photosData} />

        <div className="mt-10">
          <h2 className="text-2xl font-bold leading-none">Инстаграм</h2>

          <Input
            {...register("instagram_username")}
            className="mt-10"
            placeholder="Ваш username в Instagram"
            error={errors.instagram_username}
          />
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold">О себе</h2>

          <div className="mt-5">
            <Input
              {...register("first_name")}
              placeholder="Имя"
              error={errors.first_name}
            />

            <Input
              {...register("birthdate")}
              type="date"
              className="mt-3"
              placeholder="Возраст"
              error={errors.birthdate}
            />

            <Textarea
              {...register("about")}
              className="mt-3"
              placeholder="О себе"
              error={errors.about}
            />
          </div>

          <Button type="submit" className="mt-3 w-full">
            Сохранить
          </Button>

          <Button
            type="button"
            className="mt-3 w-full"
            onClick={handleInitData}
          >
            GET INIT DATA
          </Button>
        </div>
      </form>
    </div>
  );
};
