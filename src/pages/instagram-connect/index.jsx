import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/ui";

export const InstagramConnectPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
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
