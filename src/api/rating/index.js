import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useRating = () => {
  return useQuery({
    queryKey: ["rating"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/interactions/top`);
      return data;
    },
  });
};
