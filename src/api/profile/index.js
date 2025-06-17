import axios from "axios";
import { API_URL } from "@/constants";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

export const useCreateProfile = () =>
  useMutation({
    mutationFn: (body) =>
      axios.post(`${API_URL}/profile/`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/profile/me`);
      return data;
    },
  });
};
