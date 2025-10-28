import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const BATTLE_PAIR_QUERY_KEY = ["battle", "pair"];

const fetchBattlePair = async () => {
  const { data } = await axiosInstance.get(`${API_URL}/battle/pair`);
  return data;
};

export const useBattlePair = () =>
  useQuery({
    queryKey: BATTLE_PAIR_QUERY_KEY,
    queryFn: fetchBattlePair,
    staleTime: 0,
  });

export const useBattleVote = () =>
  useMutation({
    mutationFn: async (winnerId) => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
        params: { winner_id: winnerId },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(BATTLE_PAIR_QUERY_KEY, data);
    },
  });
