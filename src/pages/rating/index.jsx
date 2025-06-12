import { Pedestal, RatingList } from "@/components";

export const RatingPage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-scroll">
        <h1 className="font-bold text-[32px] text-black">Рейтинг</h1>

        <Pedestal />

        <RatingList
          data={[
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
            { name: "Диана", likesAmount: "2,5k" },
          ]}
        />
      </div>
    </div>
  );
};
