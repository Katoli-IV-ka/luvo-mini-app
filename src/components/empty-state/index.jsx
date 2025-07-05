import { Heart, Users, MessageCircle } from "lucide-react";

export const EmptyState = ({
  type = "likes",
  title,
  description,
  icon: Icon,
  className = "",
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case "likes":
        return {
          icon: Heart,
          title: "Пока нет лайков",
          description: "Когда кто-то поставит вам лайк, он появится здесь",
        };
      case "matches":
        return {
          icon: Users,
          title: "Пока нет взаимных симпатий",
          description:
            "Когда появится взаимная симпатия, вы сможете начать общение",
        };
      case "messages":
        return {
          icon: MessageCircle,
          title: "Нет сообщений",
          description: "Начните общение с вашими взаимными симпатиями",
        };
      default:
        return {
          icon: Heart,
          title: "Пусто",
          description: "Здесь пока ничего нет",
        };
    }
  };

  const content = {
    icon: Icon || getDefaultContent().icon,
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <content.icon className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {content.title}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed">
        {content.description}
      </p>
    </div>
  );
};
