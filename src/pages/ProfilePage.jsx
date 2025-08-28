import { useMutation } from "@tanstack/react-query";
import {
  LoaderIcon,
  MapPinIcon,
  Pencil,
  RotateCcwKey,
  ShuffleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import CostumedSelect from "../components/costumed/CostumedSelect.jsx";
import { showToast } from "../components/costumed/CostumedToast.jsx";

import Cookies from "js-cookie";
import {
  generatePresignedURL,
  getLearningLanguagesAPI,
  getNativeLanguagesAPI,
  putFileToPresignedURL,
  updateProfileAPI,
} from "../lib/api.js";
import CommonRoundedButton from "../components/buttons/CommonRoundedButton.jsx";
import {
  deepTrimObj,
  getLocalImageAsFile,
  getProfilePicUrl,
} from "../lib/utils.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const ProfilePage = () => {
  const authUser = useAuthStore((s) => s.authUser);
  console.log("Auth user in ProfilePage:", authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const { t } = useTranslation("profilePage");

  const [profilePic, setProfilePic] = useState(null);
  const profilePicInputRef = useRef(null);

  const [formState, setFormState] = useState({
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
  });

  const [nativeLanguageSelection, setNativeLanguageSelection] = useState([]);
  const [learningLanguageSelection, setLearningLanguageSelection] = useState(
    []
  );

  const [nativeLanguage, setNativeLanguage] = useState(
    authUser?.nativeLanguage || ""
  );
  const [learningLanguage, setLearningLanguage] = useState(
    authUser?.learningLanguage || ""
  );

  const { mutate: getNativeLanguagesMutation } = useMutation({
    mutationFn: getNativeLanguagesAPI,
    onSuccess: (data) => {
      setNativeLanguageSelection(data?.data);
    },
    onError: (error) => {
      showToast({
        message:
          error.response.data.message || "Failed to fetch native languages",
        type: "error",
      });
    },
  });

  const { mutate: getLearningLanguagesMutation } = useMutation({
    mutationFn: getLearningLanguagesAPI,
    onSuccess: (data) => {
      setLearningLanguageSelection(data?.data);
    },
    onError: (error) => {
      showToast({
        message:
          error.response.data.message || "Failed to fetch learning languages",
        type: "error",
      });
    },
  });

  const { mutateAsync: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateProfileAPI,
      onSuccess: (data) => {
        showToast({
          message: data?.message || t("toast.onboardingMutation.success"),
          type: "success",
        });
      },
      onError: (error) => {
        showToast({
          message:
            error.response.data.message || t("toast.onboardingMutation.error"),
          type: "error",
        });
      },
    });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 10) + 1; // 1-10 included
    const randomAvatar = `/${idx}.png`;

    getLocalImageAsFile(randomAvatar).then((file) => {
      setProfilePic(file);
    });
  };

  const validateOnboardingData = () => {
    const trimmedFormState = deepTrimObj(formState);
    trimmedFormState.nativeLanguageId = nativeLanguage.id;
    trimmedFormState.learningLanguageId = learningLanguage.id;
    const onboardingData = {
      bio: trimmedFormState.bio,
      location: trimmedFormState.location,
      nativeLanguageId: trimmedFormState.nativeLanguageId,
      learningLanguageId: trimmedFormState.learningLanguageId,
    };
    if (
      !trimmedFormState.nativeLanguageId ||
      !trimmedFormState.learningLanguageId
    ) {
      return {
        message: t("toast.validateOnboardingData.error"),
        cleanedData: onboardingData,
      };
    }
    if (!trimmedFormState.bio || !trimmedFormState.location) {
      return {
        message: "Tất cả các trường đều bắt buộc",
        cleanedData: onboardingData,
      };
    }
    return { message: null, cleanedData: onboardingData };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { message, cleanedData: onboardingData } = validateOnboardingData();
    if (message) {
      showToast({
        message,
        type: "error",
      });
      return;
    }

    try {
      let attachmentId;

      // Kiểm tra profilePic có phải File/Blob hay không
      if (profilePic instanceof File || profilePic instanceof Blob) {
        // 1) presign
        const token = Cookies.get("jwt");
        const { data: presignData } = await generatePresignedURL(
          profilePic,
          token
        );

        // 2) upload ảnh lên MinIO/S3
        await putFileToPresignedURL(
          presignData.uploadUrl,
          presignData.contentType,
          profilePic
        );

        attachmentId = presignData.attachmentId;
      } else {
        attachmentId = authUser?.attachmentId;
      }

      // 3) gọi onboarding API
      const payload = {
        ...onboardingData,
        ...(attachmentId && { attachmentId }), // chỉ thêm nếu có
      };
      const { data: profileData } = await updateProfileMutation(payload);
      setAuthUser(profileData);
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  useEffect(() => {
    getNativeLanguagesMutation();
    getLearningLanguagesMutation();
    setProfilePic(authUser?.profilePic || "");
  }, []);

  return (
    <>
      <div className="min-h-[calc(100vh-64px)]  flex items-center justify-center p-4 sm:p-6 lg:p-6">
        <div className="card bg-base-200 w-full max-w-3xl shadow-lg">
          <div className="card-body p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              {t("hero.title")}
            </h1>
            <form action="" onSubmit={handleSubmit} className="space-y-3">
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-4 relative">
                {/* IMAGE PREVIEW */}
                <div className="size-32 rounded-full bg-base-200 overflow-hidden">
                  {profilePic && (
                    <img
                      src={getProfilePicUrl(profilePic)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <CommonRoundedButton
                  className={
                    "absolute top-[calc(50%-16px)] right-[calc(50%-64px)]"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    profilePicInputRef.current.click();
                  }}
                >
                  <Pencil className="size-4" />
                </CommonRoundedButton>

                <input
                  ref={profilePicInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setProfilePic(e.target.files[0]);
                    }
                  }}
                />

                {/* Generate Random Avatar Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-secondary"
                  >
                    <ShuffleIcon className="size-4" />
                    {t("hero.genAvatarButton")}
                  </button>
                </div>
              </div>

              {/* EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{t("form.email.label")}</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={authUser.email}
                    className="input input-bordered w-full pointer-events-none text-sm"
                    placeholder={t("form.email.placeholder")}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {t("form.fullName.label")}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={authUser?.fullName || ""}
                    onChange={() => {}}
                    className="input input-bordered w-full pointer-events-none text-sm"
                    placeholder={t("form.fullName.placeholder")}
                  />
                </div>
              </div>

              <div className="!mt-6">
                <Link to="/change-password" className="btn btn-primary">
                  <RotateCcwKey className="size-4" />
                  {t("form.changePasswordButton")}
                </Link>
              </div>

              {/* BIO */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("form.bio.label")}</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  placeholder={t("form.bio.placeholder")}
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NATIVE LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {t("form.nativeLanguage.label")}
                    </span>
                  </label>

                  <CostumedSelect
                    placeholder={t("form.nativeLanguage.placeholder")}
                    options={nativeLanguageSelection}
                    onSelect={(option) => setNativeLanguage(option)}
                    defaultValue={nativeLanguage}
                  />
                </div>

                {/* LEARNING LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {t("form.learningLanguage.label")}
                    </span>
                  </label>
                  {/* <select
                    name="learningLanguage"
                    value={formState.learningLanguage.toLowerCase()}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select> */}
                  <CostumedSelect
                    placeholder={t("form.learningLanguage.placeholder")}
                    options={learningLanguageSelection}
                    onSelect={(option) => setLearningLanguage(option)}
                    defaultValue={learningLanguage}
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("form.location.label")}</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10 text-sm"
                    placeholder={t("form.location.placeholder")}
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="btn btn-primary w-full !mt-6"
                disabled={false}
                type="submit"
              >
                {!isUpdatingProfile ? (
                  <>{t("form.submitButton.text")}</>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5" />
                    {t("form.submitButton.loadingText")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
