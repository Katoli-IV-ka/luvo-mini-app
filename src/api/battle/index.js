import { API_URL } from "@/constants";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation } from "@tanstack/react-query";

export const useBattlePair = () =>
  useMutation({
    mutationFn: async (winnerId) => {
      const params = winnerId ? { winner_id: winnerId } : undefined;
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
        params,
      });
      return data;
    },
  });
