import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";
import { showToast } from "../components/costumed/CostumedToast";
import { useAuthStore } from "../stores/useAuthStore.js";
export const useLogin = () => {
  const { t } = useTranslation("loginPage");
  const queryClient = useQueryClient();
  const signInAuthStore = useAuthStore((s) => s.signInAuthStore);
  const { mutate, isPending, error } = useMutation({
    // mutationKey: ["signUp"],
    mutationFn: (loginData) => signInAuthStore(loginData),
    // update getMe in App.jsx
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      showToast({
        message: data?.message || t("toast.useLogin.success"),
        type: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error?.response?.data?.message || t("toast.useLogin.error"),
        type: "error",
      });
    },
  });
  return {
    mutate,
    isPending,
    error,
  };
};
