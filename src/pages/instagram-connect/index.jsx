import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/ui";

export const InstagramConnectPage = () => {
  const navigate = useNavigate();

  const handleNext = async () => {
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

    navigate("/user-data");
  };

  return (
    <div className="w-full min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-md p-5">
        <h2 className="text-[32px] font-bold leading-none text-black">
          Привяжите свой Instagram профиль
        </h2>

        <Input className="mt-10" placeholder="Ваш username в Intstagram" />

        <Button className="mt-3 w-full" onClick={handleNext}>
          Далее
        </Button>
      </div>
    </div>
  );
};
