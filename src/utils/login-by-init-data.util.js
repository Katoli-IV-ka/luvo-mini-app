import axios from "axios";
import { API_URL } from "@/constants";

export const loginByInitData = async (initData) => {
  const response = await axios.post(`${API_URL}/auth/`, {
    init_data: initData,
  });
  return response.data;
};
