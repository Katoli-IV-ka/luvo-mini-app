import React from "react";
import { useNavigate } from "react-router-dom";

export const UserDataPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/photo-selection");
  };

  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold mb-8 text-black">
        Luvo<span className="text-red-500">❤</span>
      </h1>

      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Данные о Вас</h2>

        <input
          type="text"
          placeholder="Имя"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        />

        <input
          type="number"
          placeholder="Возраст"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        />

        <textarea
          placeholder="О себе"
          rows="4"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
        ></textarea>

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
