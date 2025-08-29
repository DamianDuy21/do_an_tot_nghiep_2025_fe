import axios from "axios";
import Cookies from "js-cookie";
import i18n from "../i18n";
import { useAuthStore } from "../stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: `http://localhost:8080/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      config.headers["Authorization"] = `Bearer ${jwt}`;
    }

    config.headers["Accept-Language"] = i18n.language || "en";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const msg = error?.status === 401;
    if (msg) {
      try {
        const logout = useAuthStore.getState().logoutAuthStore;
        if (logout) {
          await logout({ skipRemote: true });
          Cookies.remove("jwt");
        }
      } catch (e) {
        console.error("Error during forced logout:", e);
      }
    }
    return Promise.reject(error);
  }
);
