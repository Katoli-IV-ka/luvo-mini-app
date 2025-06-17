import { useWebAppStore } from "../store";
import { USER_STORAGE_KEY } from "../constants";

export const checkTokenExpiration = () => {
  const { user } = useWebAppStore.getState();

  if (!user) return false;

  const currentTime = Math.floor(Date.now() / 1000);

  if (user.exp < currentTime) {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = "/";
    return false;
  }

  return true;
};
