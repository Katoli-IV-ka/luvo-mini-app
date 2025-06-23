import { useState, useEffect } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateProfile } from "@/api/profile";
import { useForm, FormProvider } from "react-hook-form";
import { Input, Button, Textarea } from "@/ui";

import CameraIcon from "../../assets/icons/camera.svg";

const stepSchemas = [
  yup.object({
    instagram_username: yup.string().required("Введите имя пользователя"),
  }),
  yup.object({
    first_name: yup.string().required("Имя обязательно"),
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

export const RegistrationPage = () => {
  const [step, setStep] = useState(0);
  const [genericError, setGenericError] = useState("");

  const navigate = useNavigate();
  const { mutateAsync } = useCreateProfile();

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(stepSchemas[step]),
    defaultValues: {
      instagram_username: "",
      first_name: "",
      birthdate: "",
      file: null,
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
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (photoFile && photoFile instanceof File) {
      const objectUrl = URL.createObjectURL(photoFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [photoFile]);

  // Обработка сабмита формы
  const onSubmit = async (data) => {
    if (step < stepSchemas.length - 1) {
      // Если не последний шаг, переключаемся на следующий
      setStep(step + 1);
    } else {
      // Если последний шаг, отправляем данные на сервер
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Парсим telegram username из initData
        let telegramUsername = "";
        try {
          const params = new URLSearchParams(initData);
          const userRaw = params.get("user");
          if (userRaw) {
            const parsedUser = JSON.parse(userRaw);
            telegramUsername = parsedUser.username || "";
          }
        } catch (e) {
          console.warn("Не удалось получить Telegram username:", e);
        }

        // Добавляем в форму
        formData.append("telegram_username", telegramUsername);
        formData.append("gender", "male");

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
              <h2 className="text-[32px] font-bold leading-none">
                Привяжите свой Instagram профиль
              </h2>

              <Input
                {...register("instagram_username")}
                className="mt-10"
                placeholder="Ваш username в Instagram"
                error={errors.instagram_username}
              />

              <Button className="mt-3 w-full" type="submit">
                Далее
              </Button>
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

              <Button className="mt-3 w-full" type="submit">
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
                <div className="mt-4 w-full p-4 border-2 border-primary-gray/30 bg-gray-light rounded-2xl font-semibold text-additional-red">
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
