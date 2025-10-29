import { API_URL } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useBattlePair = () => {
  return useQuery({
    queryKey: ["battle-pair"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useSubmitBattleWinner = () => {
  return useMutation({
    mutationFn: async (winnerId) => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair?winner_id=${winnerId}`);
      return data;
    },
  });
};
