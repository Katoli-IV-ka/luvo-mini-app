import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfilePhotosList } from "@/components";
// import { useTelegramInitData } from "@/hooks/useTelegramInitData";
import { Input, Button, Textarea } from "@/ui";
import { useProfile, useUpdateProfile, useProfilePhotos } from "@/api/profile";

const schema = yup.object({
  about: yup.string().optional(),
  first_name: yup.string().required("Имя обязательно"),
  instagram_username: yup.string().required("Введите имя пользователя"),
});

const aboutPlaceholders = [
  `📍 Город: Москва\n🎯 Цель: Найти друзей\n🎲 Интересы: Кино, спорт\n📎 О себе:\nРаботаю в IT, люблю путешествовать`,
  `📍 Город: Санкт-Петербург\n🎯 Цель: Общение\n🎲 Интересы: Музыка, книги\n📎 О себе:\nМаркетолог, обожаю кофе и прогулки`,
  `📍 Город: Казань\n🎯 Цель: Вдохновиться\n🎲 Интересы: Искусство, йога\n📎 О себе:\nРаботаю дизайнером, ищу единомышленников`,
  `📍 Город: Новосибирск\n🎯 Цель: Найти любовь\n🎲 Интересы: Путешествия, настолки\n📎 О себе:\nУчусь в университете, люблю активный отдых`,
  `📍 Город: Екатеринбург\n🎯 Цель: Развиваться\n🎲 Интересы: Фотография, бег\n📎 О себе:\nРаботаю в сфере образования, ценю искренность`,
];

const getRandomAboutPlaceholder = () => {
  return aboutPlaceholders[
    Math.floor(Math.random() * aboutPlaceholders.length)
  ];
};

export const ProfilePage = () => {
  const [aboutPlaceholder] = useState(getRandomAboutPlaceholder());

  // const { initData } = useTelegramInitData();
  const { mutateAsync } = useUpdateProfile();
  const { data: photosData, isLoading: photosIsLoading } = useProfilePhotos();
  const { data: profileData, isLoading: profileIsLoading } = useProfile();

  const {
    reset,
    watch,
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
    if (photosData?.length) {
      photosData.forEach((photo) => {
        const img = new Image();
        img.src = photo.url;
      });
    }
  }, [photosData]);

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

            <div className="relative mt-3">
              <Input
                {...register("birthdate")}
                type="date"
                className="peer"
                error={errors.birthdate}
              />

              {!watch("birthdate") && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all peer-focus:opacity-0 peer-focus:-translate-y-4 peer-focus:scale-90">
                  Дата рождения
                </span>
              )}
            </div>

            <Textarea
              {...register("about")}
              className="mt-3"
              placeholder={aboutPlaceholder}
              error={errors.about}
            />
          </div>

          <Button type="submit" className="mt-3 w-full">
            Сохранить
          </Button>

          {/* <Button
            className="mt-3 w-full"
            onClick={() => {
              if (!initData) return alert("initData не найдена");
              navigator.clipboard.writeText(initData).then(() => {
                alert("initData скопирована!");
              });
            }}
          >
            DATA
          </Button> */}
        </div>
      </form>
    </div>
  );
};
