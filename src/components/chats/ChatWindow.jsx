import {
  AppWindow,
  BellIcon,
  Check,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Pin,
  Video,
  X,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getLearningLanguagesAPI } from "../../lib/api";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import CostumedModal from "../costumed/CostumedModal";
import CostumedSelect from "../costumed/CostumedSelect";
import { showToast } from "../costumed/CostumedToast";
import MockConversation from "./MockConversation";
import TextEditor from "./TextEditor";
import { useChatStore } from "../../stores/useChatStore";
import { useAuthStore } from "../../stores/useAuthStore";

const ChatWindow = ({ user, onClick }) => {
  const messages = useChatStore((s) => s.messages);
  const getMessages = useChatStore((s) => s.getMessages);
  const selectedUser = useChatStore((s) => s.selectedUser);

  const authUser = useAuthStore((s) => s.authUser);
  const [isOpenUtils, setIsOpenUtils] = useState(false);
  const [useUtils, setUseUtils] = useState({
    isOpenSettings: false,
    isOpenImagesVideos: false,
    isOpenFiles: false,
  });
  const [useSettings, setUseSettings] = useState({
    isOpenNotifications: false,
    isPinned: false,
  });

  const [text, setText] = useState("");
  const handleEmojiSelect = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageSelection, setLanguageSelection] = useState([]);

  const [pendingFile, setPendingFile] = useState([]);

  const [conversation, setConversation] = useState([
    {
      sender: {
        id: 13,
        fullName: "Isabella Rossi",
        email: "isabella@example.com",
        password: "italy321",
        bio: "Imparo il vietnamita per lavoro e cultura.",
        profilePic: "https://avatar.iran.liara.run/public/05.png",
        nativeLanguage: "Italian",
        learningLanguage: "Vietnamese",
        location: "Rome",
        isOnboarded: true,
        isOnline: false,
        isRead: true,
      },
      content: "Ciao! Come va? Sto imparando il vietnamita.",
      timestamp: "2023-10-01T10:00:00Z",
    },
    {
      sender: {
        id: 14,
        fullName: "Trọng Đạt",
        email: "trongdat@example.com",
        password: "dat123",
        bio: "Mình muốn kết nối với bạn bè quốc tế.",
        profilePic: "https://avatar.iran.liara.run/public/13.png",
        nativeLanguage: "Vietnamese",
        learningLanguage: "English",
        location: "Nghệ An",
        isOnboarded: true,
        isOnline: true,
        isReady: true,
      },
      content: "Chào! Mình là Trọng Đạt. Mình đang học tiếng Ý.",
      timestamp: "2023-10-01T10:05:00Z",
    },
  ]);

  const [fakeMessageDataChatbot, setFakeMessageDataChatbot] = useState([
    {
      content:
        "Chào bạn, đây là tin nhắn thử nghiệm có cả ảnh, video và file đính kèm.",
      sender: {
        name: "Nguyễn Văn A",
        profilePic: "https://avatar.iran.liara.run/public/10.png",
        isRead: true,
      },
      timestamp: new Date().toISOString(),
      side: "left", // hoặc "right"
      files: [],
    },
    {
      content: "Đây là một tin nhắn khác với một video.",
      sender: {
        name: "Nguyễn Văn B",
        profilePic: "https://avatar.iran.liara.run/public/11.png",
        isRead: false,
      },
      timestamp: new Date().toISOString(),
      side: "right",
      files: [],
    },
    {
      content:
        "Chào bạn, đây là tin nhắn thử nghiệm có cả ảnh, video và file đính kèm.",
      sender: {
        name: "Nguyễn Văn A",
        profilePic: "https://avatar.iran.liara.run/public/10.png",
        isRead: true,
      },
      timestamp: new Date().toISOString(),
      side: "left", // hoặc "right"
      files: [],
    },
    {
      content: "Đây là một tin nhắn khác với một video.",
      sender: {
        name: "Nguyễn Văn B",
        profilePic: "https://avatar.iran.liara.run/public/11.png",
        isRead: false,
      },
      timestamp: new Date().toISOString(),
      side: "right",
      files: [],
    },
    {
      content:
        "Chào bạn, đây là tin nhắn thử nghiệm có cả ảnh, video và file đính kèm.",
      sender: {
        name: "Nguyễn Văn A",
        profilePic: "https://avatar.iran.liara.run/public/10.png",
        isRead: true,
      },
      timestamp: new Date().toISOString(),
      side: "left", // hoặc "right"
      files: [],
    },
    {
      content: "Đây là một tin nhắn khác với một video.",
      sender: {
        name: "Nguyễn Văn B",
        profilePic: "https://avatar.iran.liara.run/public/11.png",
        isRead: false,
      },
      timestamp: new Date().toISOString(),
      side: "right",
      files: [],
    },
  ]);

  const [isOpenHeaderOptions, setIsOpenHeaderOptions] = useState(false);

  const [imagesVideos, setImagesVideos] = useState([
    "https://avatar.iran.liara.run/public/03.png",
    "https://avatar.iran.liara.run/public/04.png",
    "https://avatar.iran.liara.run/public/05.png",
    "https://avatar.iran.liara.run/public/06.png",
    "https://avatar.iran.liara.run/public/07.png",
    "https://avatar.iran.liara.run/public/08.png",
    "https://avatar.iran.liara.run/public/09.png",
    "https://avatar.iran.liara.run/public/10.png",
    "https://avatar.iran.liara.run/public/11.png",
    "https://avatar.iran.liara.run/public/03.png",
    "https://avatar.iran.liara.run/public/04.png",
    "https://avatar.iran.liara.run/public/05.png",
    "https://avatar.iran.liara.run/public/06.png",
    "https://avatar.iran.liara.run/public/07.png",
    "https://avatar.iran.liara.run/public/08.png",
    "https://avatar.iran.liara.run/public/09.png",
    "https://avatar.iran.liara.run/public/10.png",
    "https://avatar.iran.liara.run/public/11.png",
    "https://avatar.iran.liara.run/public/12.png",
  ]);

  const [files, setFiles] = useState([
    "https://avatar.iran.liara.run/public/03.png",
    "https://avatar.iran.liara.run/public/04.png",
  ]);

  const { mutate: getLanguagesMutation } = useMutation({
    mutationFn: getLearningLanguagesAPI,
    onSuccess: (data) => {
      setLanguageSelection(data?.data);
    },
    onError: (error) => {
      showToast({
        message:
          error.response.data.message ||
          "Lấy danh sách ngôn ngữ không thành công. Vui lòng thử lại.",
        type: "error",
      });
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 640) {
        setIsOpenHeaderOptions(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getLanguagesMutation();
  }, []);

  useEffect(() => {
    if (authUser && authUser.email === "damianduy1302@gmail.com") {
      getMessages("68947326c8a2e0e2c3d1720e");
    } else {
      getMessages("68947336c8a2e0e2c3d17211");
    }
    setIsOpenUtils(false);
    setUseUtils({
      isOpenSettings: false,
      isOpenImagesVideos: false,
      isOpenFiles: false,
    });
    setUseSettings({
      isOpenNotifications: false,
    });
    setIsOpenHeaderOptions(false);
  }, [selectedUser]);

  return (
    <>
      <div className="h-[calc(100vh-64px)] flex relative">
        <div className="flex-1 ">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-base-300 gap-4">
            <div className="flex gap-3 items-center relative">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user?.profilePic ||
                      "https://avatar.iran.liara.run/public/21.png"
                    }
                    alt=""
                  />
                </div>
              </div>

              <div className="hidden sm:block">
                <h3 className="font-semibold text-sm">{user.fullName}</h3>
                {user && user.fullName !== "Chat bot" ? (
                  <>
                    <p className="text-xs text-success flex items-center gap-1">
                      <span className="size-2 rounded-full bg-success inline-block" />
                      Online
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs opacity-70 line-clamp-1">
                      Sẵn sàng trò chuyện cùng bạn, đây là một đoạn text rất dài
                      sẽ bị rút gọn...
                    </p>
                  </>
                )}
              </div>
              <div className="absolute -right-0 -bottom-0 sm:hidden">
                <span className="size-2 rounded-full bg-success inline-block" />
              </div>
            </div>

            <div className={`flex ${isOpenUtils ? "pr-64 lg:pr-0" : ""}`}>
              <div
                className={`flex gap-4 ${isOpenUtils ? "hidden sm:flex" : ""}`}
              >
                <div className="flex gap-2">
                  <CommonRoundedButton
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Video className="size-4" />
                  </CommonRoundedButton>

                  <CommonRoundedButton
                    className={`${
                      isOpenUtils ? "btn-secondary" : "btn-primary"
                    }`}
                    onClick={() => {
                      setIsOpenUtils(!isOpenUtils);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <AppWindow className="size-4" />
                  </CommonRoundedButton>
                </div>
                <CommonRoundedButton
                  onClick={() => {
                    onClick(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <X className="size-4" />
                </CommonRoundedButton>
              </div>

              {/* Option when the utils panel is open and screen is small */}
              <div
                className={`flex flex-col relative ${
                  isOpenUtils ? "block sm:hidden" : "hidden"
                }`}
              >
                <CommonRoundedButton
                  onClick={() => {
                    setIsOpenHeaderOptions(!isOpenHeaderOptions);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {isOpenHeaderOptions ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </CommonRoundedButton>

                <div
                  className={`absolute top-12 -right-4 p-4 z-10 border border-primary/25 bg-base-200 rounded-card ${
                    isOpenHeaderOptions ? "" : "hidden"
                  }`}
                >
                  <div className={`flex flex-col gap-4`}>
                    <CommonRoundedButton
                      onClick={() => {
                        onClick(null);
                        setIsOpenHeaderOptions(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <X className="size-4" />
                    </CommonRoundedButton>
                    <CommonRoundedButton
                      className={` ${
                        isOpenUtils ? "btn-secondary" : "btn-primary"
                      }`}
                      onClick={() => {
                        setIsOpenUtils(!isOpenUtils);
                        setIsOpenHeaderOptions(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <AppWindow className="size-4" />
                    </CommonRoundedButton>
                    <CommonRoundedButton
                      onClick={() => {
                        setIsOpenHeaderOptions(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Video className="size-4" />
                    </CommonRoundedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Chat Area */}
          <div className="flex flex-row">
            <div className="flex-1">
              {/* Chat Messages */}
              <div
                className={`overflow-y-auto p-4 ${
                  pendingFile.length === 0
                    ? "!h-[calc(100vh-64px-64px-80px)]"
                    : "!h-[calc(100vh-64px-64px-80px-112px)]"
                }`}
              >
                <MockConversation
                  user={user}
                  conversation={fakeMessageDataChatbot}
                  pendingFile={pendingFile}
                />
              </div>

              {/* Input */}
              <TextEditor
                text={text}
                setText={setText}
                pendingFile={pendingFile}
                setPendingFile={setPendingFile}
                setConversation={setFakeMessageDataChatbot}
                handleEmojiSelect={handleEmojiSelect}
              />
            </div>
          </div>
        </div>

        {/* Utils Panel */}
        {isOpenUtils && (
          <div
            className={`absolute top-0 right-0 lg:relative lg:flex lg:flex-col w-64  z-10 bg-base-100`}
          >
            <div className="border-l border-base-300">
              <div className="h-16 px-4 py-4 border-b border-base-300">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className="font-semibold text-sm">
                    Thông tin cuộc trò chuyện
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[calc(100vh-64px-64px)] overflow-y-auto flex flex-col justify-between border-l border-base-300">
              <div>
                {/* Settings */}
                <div className="flex flex-col">
                  <div
                    className={`h-16 border-base-300 flex items-center justify-center lg:justify-start px-4 cursor-pointer border-b ${
                      useUtils.isOpenSettings
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => {
                      setUseUtils((prev) => {
                        return {
                          ...prev,
                          isOpenSettings: !prev.isOpenSettings,
                        };
                      });
                    }}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        {/* <Settings className="size-4" /> */}
                        <span className="text-sm font-semibold">Cài đặt</span>
                      </div>

                      {useUtils.isOpenSettings ? (
                        <>
                          <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4" />
                        </>
                      )}
                    </div>
                  </div>
                  {useUtils.isOpenSettings && (
                    <div>
                      <div className="h-16 border-base-300 flex items-center justify-between px-4 border-b">
                        <div className="flex gap-2 items-center">
                          <BellIcon className="size-4" />
                          <span className="text-sm">Thông báo</span>
                        </div>

                        <div className="flex gap-2">
                          <CommonRoundedButton
                            onClick={() => {
                              setUseSettings((prev) => ({
                                ...prev,
                                isOpenNotifications: true,
                              }));
                            }}
                            type={
                              useSettings.isOpenNotifications
                                ? "primary"
                                : "outlined hover:btn-primary"
                            }
                          >
                            <Check className="size-4" />
                          </CommonRoundedButton>
                          <CommonRoundedButton
                            onClick={() => {
                              setUseSettings((prev) => ({
                                ...prev,
                                isOpenNotifications: false,
                              }));
                            }}
                            type={
                              !useSettings.isOpenNotifications
                                ? "primary"
                                : "outlined hover:btn-primary"
                            }
                          >
                            <X className="size-4" />
                          </CommonRoundedButton>
                        </div>
                      </div>
                      <div className="h-16 border-base-300 flex items-center justify-between px-4 border-b">
                        <div className="flex gap-2 items-center">
                          <Pin className="size-4" />
                          <span className="text-sm">Ghim</span>
                        </div>

                        <div className="flex gap-2">
                          <CommonRoundedButton
                            onClick={() => {
                              setUseSettings((prev) => ({
                                ...prev,
                                isPinned: true,
                              }));
                            }}
                            type={
                              useSettings.isPinned
                                ? "primary"
                                : "outlined hover:btn-primary"
                            }
                          >
                            <Check className="size-4" />
                          </CommonRoundedButton>
                          <CommonRoundedButton
                            onClick={() => {
                              setUseSettings((prev) => ({
                                ...prev,
                                isPinned: false,
                              }));
                            }}
                            type={
                              !useSettings.isPinned
                                ? "primary"
                                : "outlined hover:btn-primary"
                            }
                          >
                            <X className="size-4" />
                          </CommonRoundedButton>
                        </div>
                      </div>
                      {user && user.fullName === "Chat bot" && (
                        <>
                          <div className="p-4 border-b border-base-300">
                            <CostumedSelect
                              placeholder={"Ngôn ngữ"}
                              options={languageSelection}
                              onSelect={(option) => setSelectedLanguage(option)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Images/Videos */}
                <div className="flex flex-col">
                  <div
                    className={`h-16 border-base-300 flex items-center justify-center lg:justify-start px-4 border-b ${
                      useUtils.isOpenImagesVideos
                        ? "bg-base-300 cursor-pointer"
                        : ""
                    }`}
                    onClick={() => {
                      setUseUtils((prev) => {
                        return {
                          ...prev,
                          isOpenImagesVideos: false,
                        };
                      });
                    }}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        {/* <Settings className="size-4" /> */}
                        <span className="text-sm font-semibold">
                          Ảnh / Video
                        </span>
                      </div>

                      {/* {useUtils.isOpenImagesVideos ? (
                      <>
                        <ChevronUp className="size-4" />
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4" />
                      </>
                    )} */}
                    </div>
                  </div>
                  {true && (
                    <div className="min-h-16 border-base-300 p-4 border-b">
                      <div className="grid grid-cols-3 gap-4">
                        {imagesVideos.map((image, index) => {
                          if (index > 2 && !useUtils.isOpenImagesVideos)
                            return null; // Show only first 3 images/videos
                          return (
                            <div
                              key={index}
                              className="w-16 h-16 rounded-card overflow-hidden"
                            >
                              <img src={image} alt={`Image ${index + 1}`} />
                            </div>
                          );
                        })}
                      </div>

                      {imagesVideos.length > 3 && (
                        <div className="flex text-sm items-center justify-center mt-4">
                          <CommonRoundedButton
                            onClick={() => {
                              setUseUtils((prev) => ({
                                ...prev,
                                isOpenImagesVideos: !prev.isOpenImagesVideos,
                              }));
                            }}
                            type="outlined"
                          >
                            {useUtils.isOpenImagesVideos ? (
                              <ChevronsUp className="size-4" />
                            ) : (
                              <ChevronsDown className="size-4" />
                            )}
                          </CommonRoundedButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Files */}
                <div className="flex flex-col">
                  <div
                    className={`h-16 border-base-300 flex items-center justify-center lg:justify-start px-4 cursor-pointer border-b ${
                      useUtils.isOpenFiles ? "bg-base-300" : ""
                    }`}
                    onClick={() => {
                      setUseUtils((prev) => {
                        return {
                          ...prev,
                          isOpenFiles: false,
                        };
                      });
                    }}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        {/* <Settings className="size-4" /> */}
                        <span className="text-sm font-semibold">Files</span>
                      </div>

                      {/* {useUtils.isOpenImagesVideos ? (
                      <>
                        <ChevronUp className="size-4" />
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4" />
                      </>
                    )} */}
                    </div>
                  </div>
                  {true && (
                    <div className="min-h-16 border-base-300 p-4 border-b">
                      <div className="grid grid-cols-3 gap-4">
                        {files.map((file, index) => {
                          if (index > 2 && !useUtils.isOpenFiles) return null; // Show only first 3 files
                          return (
                            <div
                              key={index}
                              className="w-16 h-16 rounded-card overflow-hidden"
                            >
                              <img src={file} alt={`File ${index + 1}`} />
                            </div>
                          );
                        })}
                      </div>

                      {files.length > 3 && (
                        <div className="flex text-sm items-center justify-center mt-4">
                          <CommonRoundedButton
                            onClick={() => {
                              setUseUtils((prev) => ({
                                ...prev,
                                isOpenFiles: !prev.isOpenFiles,
                              }));
                            }}
                            type="outlined"
                          >
                            {useUtils.isOpenFiles ? (
                              <ChevronsUp className="size-4" />
                            ) : (
                              <ChevronsDown className="size-4" />
                            )}
                          </CommonRoundedButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className=" flex flex-col gap-4 p-4 pb-[15px]">
                <CostumedModal
                  trigger={
                    <div className="">
                      <div className="btn btn-outlined w-full hover:btn-error">
                        Xóa cuộc trò chuyện
                      </div>
                    </div>
                  }
                  title="Thông báo"
                >
                  {({ close }) => (
                    <div>
                      <div className="pb-6 text-sm">
                        Bạn có chắc muốn xóa cuộc trò chuyện với{" "}
                        <span className="font-semibold">{user.fullName}</span>{" "}
                        không?
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="btn btn-outlined w-full"
                          onClick={() => {
                            close();
                          }}
                        >
                          Để sau
                        </button>
                        <button
                          className="btn btn-primary w-full hover:btn-primary"
                          onClick={() => {
                            close();
                          }}
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  )}
                </CostumedModal>
                <CostumedModal
                  trigger={
                    <div className="">
                      <div className="btn btn-outlined w-full hover:btn-error">
                        Xóa lịch sử trò chuyện
                      </div>
                    </div>
                  }
                  title="Thông báo"
                >
                  {({ close }) => (
                    <div>
                      <div className="pb-6 text-sm">
                        Bạn có chắc muốn xóa lịch sử trò chuyện với{" "}
                        <span className="font-semibold">{user.fullName}</span>{" "}
                        không?
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="btn btn-outlined w-full"
                          onClick={() => {
                            close();
                          }}
                        >
                          Để sau
                        </button>
                        <button
                          className="btn btn-primary w-full hover:btn-primary"
                          onClick={() => {
                            close();
                          }}
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  )}
                </CostumedModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWindow;
