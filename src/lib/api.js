import axios from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";

// AUTH
export const getNativeLanguagesAPI = async () => {
  const response = await axiosInstance.get("/category/native-languages");
  return response.data;
};

export const getLearningLanguagesAPI = async () => {
  const response = await axiosInstance.get("/category/learning-languages");
  return response.data;
};

export const signUpAPI = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};
export const signUpVerificationAPI = async (otp) => {
  const response = await axiosInstance.post("/auth/signup/verify-otp", {
    otp,
  });
  return response.data;
};

export const loginAPI = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  const jwt = response.data?.data;

  Cookies.set("jwt", jwt, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post("/auth/logout");
  Cookies.remove("jwt", {
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
  return response.data;
};

export const getAuthUserAPI = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const generatePresignedURL = async (
  file,
  token,
  baseURL = "http://localhost:8080/api"
) => {
  if (!(file instanceof Blob)) {
    throw new TypeError("generatePresignedURL: 'file' must be a File/Blob");
  }

  const form = new FormData();
  form.append("file", file, file.name);

  const res = await axios.post(
    `${baseURL}/auth/onboarding/generate-presignedURL`,
    form,
    {
      headers: {
        "Accept-Language": "en",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: false,
    }
  );

  return res.data;
};

export const putFileToPresignedURL = async (uploadUrl, contentType, file) => {
  const res = await axios.put(uploadUrl, file, {
    headers: {
      "content-type": contentType,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    validateStatus: (s) => s >= 200 && s < 300,
  });

  return res.data;
};

export const onboardingAPI = async (userData) => {
  const response = await axiosInstance.put("/auth/onboarding", userData);
  return response.data;
};

export const resetPasswordAPI = async (email) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    email,
  });
  return response.data;
};

export const resetPasswordVerificationAPI = async ({ newPassword, otp }) => {
  const response = await axiosInstance.post("/auth/reset-password/verify-otp", {
    newPassword,
    otp,
  });
  return response.data;
};

// HOME PAGE
export const getRecommendedUsersAPI = async (args = {}) => {
  const {
    currentPage = 0,
    pageSize = 10,
    nativeLanguageId = null,
    learningLanguageId = null,
    fullName = null,
  } = args;
  const response = await axiosInstance.get("/user/explore", {
    params: {
      currentPage,
      pageSize,
      nativeLanguageId,
      learningLanguageId,
      fullName,
    },
  });
  return response.data;
};

export const getOutgoingFriendRequestsAPI = async (args = {}) => {
  const { currentPage = 0, pageSize = 10 } = args;
  const response = await axiosInstance.get("/friends/friend-requests-sent", {
    params: {
      currentPage,
      pageSize,
    },
  });
  return response.data;
};

export const sendFriendRequestAPI = async (userId) => {
  const response = await axiosInstance.post(`/friends/${userId}`);
  return response.data;
};

export const cancelFriendRequestAPI = async (requestId) => {
  const response = await axiosInstance.put(`/friends/${requestId}/cancel`);
  return response.data;
};

// NOTIFICATIONS PAGE
export const getIncomingFriendRequestsAPI = async (args = {}) => {
  const { currentPage = 0, pageSize = 10 } = args;
  const response = await axiosInstance.get(
    "/friends/friend-requests-received",
    {
      params: {
        currentPage,
        pageSize,
      },
    }
  );
  return response.data;
};

export const acceptFriendRequestAPI = async (requestId) => {
  const response = await axiosInstance.put(`/friends/${requestId}/accept`);
  return response.data;
};

export const rejectFriendRequestAPI = async (requestId) => {
  const response = await axiosInstance.put(`/friends/${requestId}/reject`);
  return response.data;
};

// FRIENDS PAGE
export const getFriendsAPI = async (args = {}) => {
  const {
    currentPage = 0,
    pageSize = 10,
    nativeLanguageId = null,
    learningLanguageId = null,
    fullName = null,
  } = args;
  const response = await axiosInstance.get("/friends", {
    params: {
      currentPage,
      pageSize,
      nativeLanguageId,
      learningLanguageId,
      fullName,
    },
  });
  return response.data;
};

export const deleteFriendAPI = async (id) => {
  const response = await axiosInstance.delete(`/friends/${id}`);
  return response.data;
};

// PROFILE PAGE
export const changePasswordAPI = async ({ oldPassword, newPassword }) => {
  const response = await axiosInstance.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const changePasswordVerificationAPI = async (otp) => {
  const response = await axiosInstance.post(
    "/auth/change-password/verify-otp",
    {
      otp,
    }
  );
  return response.data;
};

export const updateProfileAPI = async (userData) => {
  const response = await axiosInstance.put("/user", userData);
  return response.data;
};
