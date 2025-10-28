import { API_URL } from "@/constants";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation } from "@tanstack/react-query";

const normalizeBattlePairResponse = (rawResponse) => {
  const payload = rawResponse?.data ?? rawResponse;

  const stage = payload?.stage ?? null;
  const profiles = Array.isArray(payload?.profiles) ? payload.profiles : [];

  return {
    stage,
    profiles,
  };
};

export const useBattlePair = () =>
  useMutation({
    mutationFn: async (winnerId) => {
      const params = winnerId ? { winner_id: winnerId } : undefined;
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
        params,
      });

      return normalizeBattlePairResponse(data);
    },
  });
