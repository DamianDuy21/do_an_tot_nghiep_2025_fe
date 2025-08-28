import {
  Angry,
  ArrowDownToLine,
  Check,
  CheckCheck,
  CheckCheckIcon,
  ChevronDown,
  ChevronUp,
  Copy,
  File,
  Frown,
  Heart,
  Languages,
  LoaderIcon,
  Smile,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import CostumedModal from "../costumed/CostumedModal";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import { useEffect, useRef, useState } from "react";
import {
  copyToClipboard,
  formatFileSize,
  getFileExtension,
} from "../../lib/utils";
import toast from "react-hot-toast";
import axios from "axios";

const Message = ({
  content,
  ref,
  sender,
  timestamp,
  side,
  files,
  isOpen,
  onToggle,
}) => {
  const [imageAndVideoFiles, setImageAndVideoFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);

  const [isCopied, setIsCopied] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [showAllTranslations, setShowAllTranslations] = useState(true);

  const [reactions, setReactions] = useState({
    thumbsUp: 0,
    thumbsDown: 0,
    heart: 0,
  });

  useEffect(() => {
    if (files && files.length > 0) {
      const imagesAndVideos = files.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      const others = files.filter((file) => !imagesAndVideos.includes(file));
      setImageAndVideoFiles(imagesAndVideos);
      setOtherFiles(others);
    }
  }, [files]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 3000);
    }
    return () => {
      clearTimeout();
    };
  }, [isCopied]);

  useEffect(() => {
    if (isOpen) {
      setIsCopied(false);
    }
  }, [isOpen]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
  });

  const [isTranslatingText, setIsTranslatingText] = useState(false);
  const handleTranslateTextOpenaiAPI = async (
    text,
    targetLang,
    formality = "auto"
  ) => {
    try {
      setIsTranslatingText(true);
      const response = await axiosInstance.post("/openai/translate", {
        text,
        targetLang,
        formality,
      });
      setTranslatedText(response.data.translated);
    } catch (error) {
      toast.error("Error translating text. Please try again.");
      console.error("Error translating text:", error);
    } finally {
      setIsTranslatingText(false);
    }
  };

  return (
    <>
      {/* avatar */}
      <div className={`avatar ${side === "left" ? "" : "order-2"}`}>
        <div className="w-10 rounded-full">
          <img
            src={
              sender?.profilePic ||
              "https://avatar.iran.liara.run/public/21.png"
            }
            alt=""
          />
        </div>
      </div>

      {/* content */}
      {content && content.trim() !== "" && (
        <div className="flex flex-col gap-1 max-w-[50%]" ref={ref}>
          <div className="flex items-center gap-2">
            {/* max-w-[calc(100%-32px)] */}
            <div className="flex flex-col gap-1">
              <div
                className=" bg-base-300 px-4 py-3 rounded-btn flex flex-col gap-2 cursor-pointer relative group"
                onClick={onToggle}
              >
                <div className="text-sm break-words whitespace-pre-wrap max-w-full">
                  {content}
                </div>

                <div
                  className={`hidden group-hover:flex absolute top-[9px] 
                  right-2 border border-base-300 bg-base-100 px-2 py-1.5 rounded-card`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (content && !isCopied) {
                      await copyToClipboard(content);
                      setIsCopied(true);
                    }
                  }}
                >
                  {isCopied ? (
                    <>
                      <CheckCheckIcon
                        className="size-3 text-green-500"
                        title="Check"
                      />
                    </>
                  ) : (
                    <>
                      <Copy
                        className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200"
                        title="Copy"
                      />
                    </>
                  )}
                </div>
              </div>
              {translatedText && (
                <div className=" bg-base-100 border border-base-300 px-4 py-3 rounded-btn flex flex-col gap-2 relative group">
                  <div className="text-sm break-words whitespace-pre-wrap max-w-full">
                    {showAllTranslations
                      ? translatedText
                      : `${translatedText.slice(0, 50)}...`}
                  </div>
                  <div
                    className={`hidden group-hover:flex absolute top-[9px] 
                  right-2  gap-1 items-center`}
                  >
                    {isCopied ? (
                      <div className="border border-base-300 bg-base-100 px-2 py-1.5 rounded-card">
                        <CheckCheckIcon
                          className="size-3 text-green-500"
                          title="Check"
                        />
                      </div>
                    ) : (
                      <div className="border border-base-300 bg-base-100 px-2 py-1.5 rounded-card">
                        <Copy
                          className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200"
                          title="Copy"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (translatedText) {
                              await copyToClipboard(translatedText);
                              setIsCopied(true);
                            }
                          }}
                        />
                      </div>
                    )}

                    {translatedText && translatedText.length > 100 && (
                      <>
                        {showAllTranslations ? (
                          <CommonRoundedButton
                            className=" rounded-full w-6 h-6"
                            onClick={() => {
                              setShowAllTranslations(false);
                            }}
                          >
                            <ChevronUp className="size-4" />
                          </CommonRoundedButton>
                        ) : (
                          <CommonRoundedButton
                            className="rounded-full w-6 h-6"
                            onClick={() => {
                              setShowAllTranslations(true);
                            }}
                          >
                            <ChevronDown className="size-4" />
                          </CommonRoundedButton>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* timestamp */}
              {/* <div className="flex gap-2 ml-auto">
            <div className="text-xs opacity-70">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
            {sender.isRead && (
              <div className="text-xs opacity-70 flex items-center gap-1">
                <CheckCheck className="size-3 relative top-[1px] text-primary" />
                <span>Seen</span>
              </div>
            )}
          </div> */}
            </div>
            {/* <div
          className={`${
            sender.isRead ? "relative -top-3" : "relative -top-1"
          } text-xs bg-base-300 !w-6 !h-6 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center`}
        >
          <span className="relative -top-1">...</span>
        </div> */}
          </div>
          <div
            className={`flex gap-1 items-center justify-${
              side !== "left" ? "start" : "end"
            }`}
          >
            {reactions.heart > 0 && (
              <div
                className={`border border-base-300 bg-base-100 px-2 py-1 rounded-card gap-1 flex items-center ${
                  side !== "left" ? "order-2" : "order-1"
                }`}
              >
                <Heart
                  className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200 fill-red-500 order-2"
                  onClick={() =>
                    setReactions({ ...reactions, heart: reactions.heart - 1 })
                  }
                />

                <span className="text-xs opacity-70 order-2 relative -top-[0.5px]">
                  {reactions.heart}
                </span>
              </div>
            )}

            {reactions.thumbsUp > 0 && (
              <div
                className={`border border-base-300 bg-base-100 px-2 py-1 rounded-card gap-1 flex items-center ${
                  side !== "left" ? "order-2" : "order-1"
                }`}
              >
                <ThumbsUp
                  className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200 fill-primary/25 order-2"
                  onClick={() =>
                    setReactions({
                      ...reactions,
                      thumbsUp: reactions.thumbsUp - 1,
                    })
                  }
                />

                <span className="text-xs opacity-70 order-2 relative -top-[0.5px]">
                  {reactions.thumbsUp}
                </span>
              </div>
            )}

            {reactions.thumbsDown > 0 && (
              <div
                className={`border border-base-300 bg-base-100 px-2 py-1 rounded-card gap-1 flex items-center ${
                  side !== "left" ? "order-2" : "order-1"
                }`}
              >
                <ThumbsDown
                  className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200 fill-primary/25 order-2"
                  onClick={() =>
                    setReactions({
                      ...reactions,
                      thumbsDown: reactions.thumbsDown - 1,
                    })
                  }
                />

                <span className="text-xs opacity-70 order-2 relative -top-[0.5px]">
                  {reactions.thumbsDown}
                </span>
              </div>
            )}

            <div
              className={`border border-base-300 bg-base-100 px-2 py-1.5 rounded-card gap-2.5 ${
                side !== "left" ? "order-1" : "order-2"
              }  ${isOpen ? "flex" : "hidden"}`}
            >
              <div className="group flex gap-2.5">
                <Heart
                  className={`size-3 cursor-pointer hover:scale-105 transition-transform duration-200 hover:fill-red-500 order-${
                    side === "left" ? "1" : "0"
                  }`}
                  onClick={() =>
                    setReactions({ ...reactions, heart: reactions.heart + 1 })
                  }
                />

                <div className="hidden group-hover:flex gap-2.5">
                  <ThumbsUp
                    className={`size-3 cursor-pointer hover:scale-105 transition-transform duration-200 hover:fill-primary/25 order-${
                      side === "left" ? "1" : "0"
                    }`}
                    onClick={() =>
                      setReactions({
                        ...reactions,
                        thumbsUp: reactions.thumbsUp + 1,
                      })
                    }
                  />

                  <ThumbsDown
                    className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200 hover:fill-primary/25"
                    onClick={() =>
                      setReactions({
                        ...reactions,
                        thumbsDown: reactions.thumbsDown + 1,
                      })
                    }
                  />
                </div>
              </div>

              {isTranslatingText ? (
                <>
                  <LoaderIcon className="animate-spin size-3" />
                </>
              ) : (
                <Languages
                  className="size-3 cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    handleTranslateTextOpenaiAPI(content, "en");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {files && files.length > 0 && (
        <div className="flex items-center gap-2 max-w-[75%]">
          <div className="flex flex-col gap-2">
            {/* Block 1: Ảnh & Video */}
            {imageAndVideoFiles.length > 0 && (
              <div
                className={`flex flex-wrap gap-1 ${
                  side === "left" ? "justify-start" : "justify-end"
                }`}
              >
                {imageAndVideoFiles.map((file, index) =>
                  file.type.startsWith("image/") ? (
                    <CostumedModal
                      key={index}
                      trigger={
                        <div className="relative h-[max-content] w-fit cursor-pointer group">
                          <img
                            src={file.url}
                            alt="preview"
                            className="h-24 min-w-20 !rounded-btn border border-base-300 bg-base-100 p-1"
                          />
                          <CommonRoundedButton
                            className="hidden group-hover:flex absolute top-1 right-1 cursor-pointer bg-primary/25 p-1 rounded-full !size-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              const link = document.createElement("a");
                              link.href = file.url;
                              link.download = file.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            type="primary"
                          >
                            <ArrowDownToLine className="size-3" />
                          </CommonRoundedButton>
                        </div>
                      }
                    >
                      <img
                        src={file.url}
                        alt="full preview"
                        className="w-full h-auto max-h-[80vh] rounded"
                      />
                    </CostumedModal>
                  ) : (
                    <CostumedModal
                      key={index}
                      trigger={
                        <div className="relative h-[max-content] w-fit cursor-pointer group">
                          <video
                            src={file.url}
                            className="h-24 min-w-40 !rounded-btn border border-base-300 bg-base-100 p-1"
                          />
                          <CommonRoundedButton
                            className="hidden group-hover:flex absolute top-1 right-1 cursor-pointer bg-primary/25 p-1 rounded-btn !size-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              const link = document.createElement("a");
                              link.href = file.url;
                              link.download = file.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            type="primary"
                          >
                            <ArrowDownToLine className="size-3" />
                          </CommonRoundedButton>
                        </div>
                      }
                    >
                      <video
                        src={file.url}
                        controls
                        className="w-full h-auto max-h-[80vh] rounded"
                      />
                    </CostumedModal>
                  )
                )}
              </div>
            )}

            {/* Block 2: Các loại file khác */}
            {otherFiles.length > 0 && (
              <div
                className={`flex flex-wrap gap-1 justify-${
                  side === "left" ? "start" : "end"
                }`}
              >
                {otherFiles.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm bg-base-100 border border-base-300 px-4 py-2 w-[200px] lg:w-auto lg:max-w-[360px] rounded-btn flex items-center gap-3 relative group"
                  >
                    <div>
                      {" "}
                      <File className="!size-4" />{" "}
                    </div>
                    <div className="flex flex-col gap-1 truncate">
                      <span className="truncate">{file.name}</span>
                      <div className="flex items-center gap-1 ">
                        <span className="text-xs opacity-70">
                          {formatFileSize(file.size ?? 0)}
                        </span>

                        <span className="text-xs opacity-70">
                          {getFileExtension(file.name)}
                        </span>
                      </div>
                    </div>

                    <CommonRoundedButton
                      className="hidden group-hover:flex absolute top-1 right-1 cursor-pointer bg-primary/25 p-1 rounded-full !size-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        const link = document.createElement("a");
                        link.href = file.url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      type="primary"
                    >
                      <ArrowDownToLine className="size-3" />
                    </CommonRoundedButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
