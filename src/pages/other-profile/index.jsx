import { useParams } from "react-router-dom";
import { useOtherUser } from "@/api/user";
import { OtherProfileCard, Spinner } from "@/components";

// import TelegramIcon from "./telegram.png";
import InstragramIcon from "./instagram.png";

export const OtherProfilePage = () => {
  const { id } = useParams();
  const { data, isLoading } = useOtherUser(id);

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    return isBirthdayPassed ? age : age - 1;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <OtherProfileCard card={data} />

        <div className="mt-10">
          <h2 className="font-bold text-2xl">
            {data.first_name}, {calculateAge(data.birthdate)}
          </h2>

          {data.about && <div className="mt-3 text-base">{data.about}</div>}
        </div>

        <div className="mt-10">
          {data.instagram_username && (
            <div className="flex">
              <img
                src={InstragramIcon}
                alt="instagram-icon"
                className="size-8"
              />
              <div className="ml-2 font-bold text-2xl">
                @{data.instagram_username}
              </div>
            </div>
          )}

          {/* {data.telegram_username && (
            <div className="mt-3 flex">
              <img src={TelegramIcon} alt="telegram-icon" className="size-8" />
              <div className="ml-2 font-bold text-2xl">
                @{data.telegram_username}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
