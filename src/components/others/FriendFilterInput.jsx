import { Funnel, LoaderIcon } from "lucide-react";
import CostumedSelect from "../costumed/CostumedSelect";
import { useEffect, useState } from "react";
import { showToast } from "../costumed/CostumedToast";
import { getLearningLanguagesAPI, getNativeLanguagesAPI } from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const FriendFilterInput = ({ data, onChange, onSubmit }) => {
  const { t } = useTranslation("onboardingPage");
  const [nativeLanguageSelection, setNativeLanguageSelection] = useState([]);
  const [learningLanguageSelection, setLearningLanguageSelection] = useState(
    []
  );
  const { mutate: getNativeLanguagesMutation } = useMutation({
    mutationFn: getNativeLanguagesAPI,
    onSuccess: (data) => {
      setNativeLanguageSelection(data?.data);
    },
    onError: (error) => {
      showToast({
        message:
          error.response.data.message ||
          t("toast.getNativeLanguagesMutation.error"),
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
          error.response.data.message ||
          t("toast.getLearningLanguagesMutation.error"),
        type: "error",
      });
    },
  });
  useEffect(() => {
    getNativeLanguagesMutation();
    getLearningLanguagesMutation();
  }, []);

  useEffect(() => {}, [data]);
  return (
    <>
      <form
        action=""
        className="mb-4 bg-base-200 p-4 pt-2 rounded-card flex flex-col xl:flex-row items-end gap-6 xl:gap-4"
      >
        <div className="xl:flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Họ và tên</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={data.fullName}
                onChange={(e) => {
                  onChange({ ...data, fullName: e.target.value });
                }}
                className="input input-bordered w-full text-sm"
                placeholder={"Nhập họ và tên bạn muốn tìm kiếm"}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ngôn ngữ mẹ đẻ</span>
              </label>

              <CostumedSelect
                placeholder={"Chọn ngôn ngữ mẹ đẻ"}
                options={nativeLanguageSelection}
                onSelect={(e) => {
                  onChange({ ...data, nativeLanguage: e });
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ngôn ngữ bạn đang học</span>
              </label>

              <CostumedSelect
                placeholder={"Chọn ngôn ngữ bạn đang học"}
                options={learningLanguageSelection}
                onSelect={(e) => {
                  onChange({ ...data, learningLanguage: e });
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="btn btn-primary flex gap-2 items-center w-full xl:w-auto xl:mt-0"
          disabled={false}
          onClick={onSubmit}
        >
          {/* <Search className="size-4" /> */}
          <Funnel className="size-4" />
          {true ? (
            <>Lọc</>
          ) : (
            <>
              <LoaderIcon className="animate-spin size-5" />
              Đang lọc...
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default FriendFilterInput;
