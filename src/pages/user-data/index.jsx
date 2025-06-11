import React from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/ui";
import { Textarea } from "../../ui/textarea";

export const UserDataPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/photo-selection");
  };

  return (
    <div className="w-full min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-md p-5">
        <h2 className="text-[32px] font-bold text-black">Данные о Вас</h2>

        <div className="mt-10">
          <Input placeholder="Имя" />
          <Input className="mt-3" placeholder="Возраст" />
          <Textarea className="mt-3" placeholder="О себе" />
        </div>

        <Button className="mt-3 w-full" onClick={handleNext}>
          Далее
        </Button>
      </div>
    </div>
  );
};
