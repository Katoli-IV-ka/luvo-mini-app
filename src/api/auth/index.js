import axios from "axios";
import { API_URL } from "@/constants";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation({
    mutationFn: (body) => axios.post(`${API_URL}/auth/login`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });
