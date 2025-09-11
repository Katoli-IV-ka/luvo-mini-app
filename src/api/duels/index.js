import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useDuelPair = () => {
  return useQuery({
    queryKey: ["duel-pair"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`);
      return data;
    },
  });
};

export const useDuelNextPair = () => {
  return useMutation({
    mutationFn: async (winnerId) => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
        params: { winner_id: winnerId },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["duel-pair"], data);
    },
  });
};
