import { forwardRef, useEffect, useState } from "react";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarDays } from "lucide-react";
import { ABOUT_PLACEHOLDER } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import { useTelegramInitData } from "@/hooks/useTelegramInitData";
import { Input, Button, Textarea } from "@/ui";
import { ProfilePhotosList, Spinner } from "@/components";
import { useUser, useUpdateUser, useUserPhotos } from "@/api/user";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className="mt-3 w-full py-[18px] px-4 flex justify-between rounded-[30px] leading-5 text-xl border-2 border-primary-gray/30 bg-gray-light dark:bg-transparent"
  >
    <div
      className={`w-full text-left ${
        value ? "text-gray-800" : "text-gray-400"
      }`}
    >
      {value || "Дата рождения"}
    </div>

    <CalendarDays className="w-4 h-4 ml-2 opacity-60" />
  </button>
));

const schema = yup.object({
  about: yup.string().optional(),
  first_name: yup.string().required("Имя обязательно"),
  instagram_username: yup.string().required("Введите имя пользователя"),
});

const getRandomAboutPlaceholder = () => {
  return ABOUT_PLACEHOLDER[
    Math.floor(Math.random() * ABOUT_PLACEHOLDER.length)
  ];
};

export const ProfilePage = () => {
  const [aboutPlaceholder] = useState(getRandomAboutPlaceholder());
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useTelegramInitData();
  const { mutateAsync } = useUpdateUser();
  const { data: userData, isLoading: userIsLoading } = useUser();
  const { data: userPhotosData, isLoading: userPhotosIsLoading } =
    useUserPhotos();

  const {
    reset,
    control,
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
      setIsLoading(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("gender", "male");

      const { exp, user_id, has_profile, access_token } = await mutateAsync(
        formData
      );

      if (access_token) {
        setUser({
          id: user_id,
          exp: exp,
          isRegister: has_profile,
          accessToken: access_token,
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Ошибка создания профиля", err);
      setGenericError(err?.response?.data?.detail || "Что-то пошло не так");
    }
  };

  useEffect(() => {
    if (userPhotosData?.length) {
      userPhotosData.forEach((photo) => {
        const img = new Image();
        img.src = photo.url;
      });
    }
  }, [userPhotosData]);

  useEffect(() => {
    if (userData) {
      reset({
        about: userData.about || "",
        birthdate: userData.birthdate || "",
        first_name: userData.first_name || "",
        instagram_username: userData.instagram_username || "",
      });
    }
  }, [userData, reset]);

  if (userIsLoading || userPhotosIsLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <form
        className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfilePhotosList photos={userPhotosData} />

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

            <Controller
              name="birthdate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  customInput={<CustomDateInput />}
                  dateFormat="dd.MM.yyyy"
                  wrapperClassName="w-full"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            />

            <Textarea
              {...register("about")}
              className="mt-3"
              placeholder={aboutPlaceholder}
              error={errors.about}
            />
          </div>

          <Button type="submit" className="mt-3 w-full">
            {!isLoading ? "Сохранить" : <Spinner size="sm" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
