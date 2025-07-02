import { useState, useEffect } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateProfile } from "@/api/profile";
import { useTelegramInitData } from "@/hooks/useTelegramInitData";
import { useForm, FormProvider } from "react-hook-form";
import { Input, Button, Textarea } from "@/ui";

import CameraIcon from "../../assets/icons/camera.svg";

const stepSchemas = [
  yup.object({
    instagram_username: yup.string().required("Введите имя пользователя"),
  }),
  yup.object({
    first_name: yup.string().required("Имя обязательно"),
    birthdate: yup.string().required("Дата рождения обязательна"),
    gender: yup
      .string()
      .oneOf(["male", "female"], "Укажите пол")
      .required("Пол обязателен"),
    about: yup.string().optional(),
  }),
  yup.object({
    file: yup
      .mixed()
      .required("Фото обязательно")
      .test(
        "fileSize",
        "Файл слишком большой",
        (file) => !file || file.size < 5000000
      ),
  }),
];

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

export const RegistrationPage = () => {
  const [step, setStep] = useState(0);
  const [aboutPlaceholder] = useState(getRandomAboutPlaceholder());
  const [preview, setPreview] = useState(null);
  const [genericError, setGenericError] = useState("");

  const navigate = useNavigate();
  const { mutateAsync } = useCreateProfile();
  const {
    //  initData,
    telegramUsername,
  } = useTelegramInitData();

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(stepSchemas[step]),
    defaultValues: {
      file: null,
      about: "",
      gender: "",
      birthdate: "",
      first_name: "",
      instagram_username: "",
    },
  });

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const photoFile = watch("file");

  useEffect(() => {
    if (photoFile && photoFile instanceof File) {
      const objectUrl = URL.createObjectURL(photoFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [photoFile]);

  const onSubmit = async (data) => {
    if (step < stepSchemas.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append("telegram_username", telegramUsername);

        if (!telegramUsername) {
          setGenericError("Ошибка: Telegram данные не получены.");
          return;
        }

        await mutateAsync(formData);
        navigate("/feed");
      } catch (err) {
        console.error("Ошибка регистрации", err);
        setGenericError(err?.response?.data?.detail);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">
        <form
          className="container mx-auto max-w-md p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {step === 0 && (
            <>
              <h2 className="text-[32px] font-bold">Привяжите Instagram</h2>

              <Input
                {...register("instagram_username")}
                className="mt-10"
                placeholder="Ваш username в Instagram"
                error={errors.instagram_username}
              />

              <Button className="mt-3 w-full" type="submit">
                Далее
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
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-[32px] font-bold">Данные о Вас</h2>

              <div className="mt-10">
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

                <div className="mt-4">
                  <div className="flex gap-6">
                    {["male", "female"].map((value) => {
                      const label = value === "male" ? "Мужской" : "Женский";
                      return (
                        <label
                          key={value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            value={value}
                            {...register("gender")}
                            className="hidden peer"
                          />

                          <div className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-gray-400 peer-checked:border-primary-red">
                            <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary-red transition-all" />
                          </div>

                          <span className="transition font-semibold">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {errors.gender && (
                    <p className="mt-2 text-light-red font-semibold">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <Textarea
                  {...register("about")}
                  className="mt-4"
                  placeholder={aboutPlaceholder}
                  error={errors.about}
                />
              </div>

              <Button className="mt-4 w-full" type="submit">
                Далее
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-[32px] font-bold">Выберите фото</h2>

              <div className="mt-10 w-full aspect-square mx-auto flex items-center justify-center border-4 border-primary-gray/30 bg-gray-light rounded-[20px] relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer rounded-[20px]"
                  onChange={(e) =>
                    setValue("file", e.target.files?.[0], {
                      shouldValidate: true,
                    })
                  }
                />

                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="object-cover w-full h-full rounded-[20px]"
                  />
                ) : (
                  <img
                    src={CameraIcon}
                    alt="camera-icon"
                    className="size-[130px]"
                  />
                )}
              </div>

              {errors.file && (
                <p className="mt-2 text-light-red text-sm">
                  {errors.file.message}
                </p>
              )}

              {genericError && (
                <div className="mt-4 w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl font-semibold text-light-red">
                  {genericError}
                </div>
              )}

              <Button className="mt-3 w-full" type="submit">
                Завершить
              </Button>
            </>
          )}
        </form>
      </div>
    </FormProvider>
  );
};
