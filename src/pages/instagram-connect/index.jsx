import { useWebAppStore } from "@/store";
import { useNavigate } from "react-router-dom";

export const InstagramConnectPage = () => {
  const { user, loading } = useWebAppStore();
  const navigate = useNavigate();

  console.log(user, loading);
  console.log("INSTAGRAM PAGE");

  const handleNext = () => {
    navigate("/user-data");
  };

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <h1 className="text-4xl font-bold mb-8 text-black">
        Luvo<span className="text-red-500">❤</span>
      </h1>

      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Привяжите свой Instagram профиль
        </h2>

        <input
          type="text"
          placeholder="Ваш username в Instagram"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        />

        <button
          className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          onClick={handleNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
