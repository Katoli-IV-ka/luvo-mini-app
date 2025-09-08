import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

// Мок-данные для тестирования дуэлей
const mockUsers = [
  {
    id: 1,
    name: "Анна",
    age: 24,
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 2,
    name: "Максим",
    age: 26,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 3,
    name: "София",
    age: 22,
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 4,
    name: "Дмитрий",
    age: 28,
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 5,
    name: "Екатерина",
    age: 25,
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 6,
    name: "Александр",
    age: 27,
    photos: [
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519345182560-3f2913c4c4c4?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 7,
    name: "Мария",
    age: 23,
    photos: [
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 8,
    name: "Иван",
    age: 29,
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 9,
    name: "Алиса",
    age: 21,
    photos: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
    ],
  },
  {
    id: 10,
    name: "Артем",
    age: 30,
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
    ],
  },
];

// Функция для проверки наличия валидного фото
const hasValidPhoto = (user) => {
  if (!user || user.photos == null) return false;
  if (Array.isArray(user.photos)) {
    const first = user.photos[0];
    return Boolean(first && typeof first === "string" && first.trim().length);
  }
  return Boolean(
    user.photos && typeof user.photos === "string" && user.photos.trim().length
  );
};

// Функция для получения случайной пары пользователей
const getRandomPair = () => {
  const available = mockUsers.filter(hasValidPhoto);
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return {
    users: shuffled.slice(0, 2),
  };
};

// Получение случайных пользователей для дуэли
export const useDuelUsers = () => {
  return useQuery({
    queryKey: ["duel-users"],
    queryFn: async () => {
      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Возвращаем мок-данные
      return getRandomPair();
    },
    staleTime: 0, // Всегда запрашиваем свежих пользователей
    cacheTime: 0, // Не кешируем
  });
};

// Отправка результата дуэли
export const useDuelVote = () => {
  return useMutation({
    mutationFn: async ({ winnerId, loserId }) => {
      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 800));

      // В реальном приложении здесь был бы запрос к API
      // axiosInstance.post(`${API_URL}/duels/vote`, {
      //   winner_id: winnerId,
      //   loser_id: loserId,
      // });

      // Для мок-данных просто возвращаем успешный ответ
      return { success: true, winnerId, loserId };
    },
    onSuccess: () => {
      // Инвалидируем кеш дуэлей для получения новой пары
      queryClient.invalidateQueries({ queryKey: ["duel-users"] });
      // Также обновляем рейтинг
      queryClient.invalidateQueries({ queryKey: ["rating"] });
    },
  });
};
