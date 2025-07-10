import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useLogin = () =>
  useMutation({
    mutationFn: (body) => axiosInstance.post(`${API_URL}/auth/login`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });
