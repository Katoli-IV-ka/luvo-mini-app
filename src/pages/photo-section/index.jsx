import React from "react";
import { FiCamera } from "react-icons/fi";

export const PhotoSelectionPage = () => {
  return (
    <div className="flex flex-col items-center justify-start p-4">
      <h1 className="text-4xl font-bold mb-8 text-black">
        Luvo<span className="text-red-500">❤</span>
      </h1>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-8 text-center">Выберите фото</h2>

        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-8 border border-gray-300">
          <FiCamera size={64} className="text-gray-400" />
        </div>

        <button className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          Готово
        </button>
      </div>
    </div>
  );
};
