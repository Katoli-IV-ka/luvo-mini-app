import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfilePhotosList } from "@/components";
import { Input, Button, Textarea } from "@/ui";
import { useProfile, useUpdateProfile } from "@/api/profile";

import LikesImage from "./likes.png";

const schema = yup.object({
  instagram_username: yup.string().required("Введите имя пользователя"),
  first_name: yup.string().required("Имя обязательно"),
  about: yup.string().optional(),
});

export const ProfilePage = () => {
  const { data, isLoading } = useProfile();

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

  useEffect(() => {
    if (data) {
      reset({
        instagram_username: data.instagram_username || "",
        first_name: data.first_name || "",
        about: data.about || "",
        birthdate: data.birthdate || "",
      });
    }
  }, [data, reset]);

  if (isLoading) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <form
        className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfilePhotosList photos={[LikesImage, LikesImage, LikesImage]} />

        <div className="mt-10">
          <h2 className="text-2xl font-bold leading-none text-black">
            Инстаграм
          </h2>

          <Input
            {...register("instagram_username")}
            className="mt-10"
            placeholder="Ваш username в Instagram"
            error={errors.instagram_username}
          />
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold text-black">О себе</h2>

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
        </div>
      </form>
    </div>
  );
};
