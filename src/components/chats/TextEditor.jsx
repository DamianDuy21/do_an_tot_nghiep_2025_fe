import { File, Forward, LoaderIcon, Paperclip, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import CostumedEmojiPicker from "../costumed/CostumedEmojiPicker";
import CostumedModal from "../costumed/CostumedModal";
import { formatFileSize, getFileExtension } from "../../lib/utils";
import { useChatStore } from "../../stores/useChatStore";
import axios from "axios";

const TextEditor = ({
  text,
  setText,
  handleEmojiSelect,
  setConversation,
  pendingFile,
  setPendingFile,
}) => {
  const sendMessage = useChatStore((s) => s.sendMessage);
  const selectedUser = useChatStore((s) => s.selectedUser);

  const lastFileInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    const newFiles = files.map((file) => {
      const fileUrl = URL.createObjectURL(file);
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
      };
    });

    setPendingFile((prev) => [...prev, ...newFiles]);

    event.target.value = null;
    if (lastFileInputRef.current) {
      const timeout = setTimeout(() => {
        if (lastFileInputRef.current) {
          lastFileInputRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  };

  const handleRemoveFile = (index) => {
    setPendingFile((prev) => prev.filter((_, i) => i !== index));
    if (lastFileInputRef.current) {
      lastFileInputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (text.trim() === "" && pendingFile.length === 0) return;

    try {
      await sendMessage({
        text: text.trim(),
      });
      setText("");

      // Clear form
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // Scroll
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    // const newMessages = [];
    // const sender = {
    //   id: 13,
    //   fullName: "Isabella Rossi",
    //   email: "isabella@example.com",
    //   password: "italy321",
    //   bio: "Imparo il vietnamita per lavoro e cultura.",
    //   profilePic: "https://avatar.iran.liara.run/public/05.png",
    //   nativeLanguage: "Italian",
    //   learningLanguage: "Vietnamese",
    //   location: "Rome",
    //   isOnboarded: true,
    //   isOnline: false,
    //   isRead: true,
    // };

    // 1. Tin nhắn content
    // if (text.trim()) {
    //   newMessages.push({
    //     sender,
    //     content: text.trim(),
    //     files: [],
    //     timestamp: new Date().toISOString(),
    //   });
    // }

    // 2. Phân loại files
    // const imageAndVideoFiles = pendingFile.filter(
    //   (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    // );
    // const otherFiles = pendingFile.filter(
    //   (file) =>
    //     !file.type.startsWith("image/") && !file.type.startsWith("video/")
    // );

    // 3. Tin nhắn chứa ảnh & video (nếu có)
    // if (imageAndVideoFiles.length > 0) {
    //   newMessages.push({
    //     sender,
    //     content: "",
    //     files: imageAndVideoFiles,
    //     timestamp: new Date().toISOString(),
    //   });
    // }

    // 4. Tin nhắn chứa các file khác (nếu có)
    // if (otherFiles.length > 0) {
    //   newMessages.push({
    //     sender,
    //     content: "",
    //     files: otherFiles,
    //     timestamp: new Date().toISOString(),
    //   });
    // }

    // 5. Cập nhật tin nhắn
    // setConversation((prev) => [...prev, ...newMessages]);

    // 6. Reset input
    // setText("");
    // setPendingFile([]);
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = null;
    // }

    // 7. Scroll lên đầu
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
  });

  const chatOpenaiAPI = async (messages, model = "gpt-4o-mini") => {
    try {
      const { data } = await axiosInstance.post("/openai/chat", {
        messages,
        model,
      });
      return data;
    } catch (error) {
      console.error("Error sending message to OpenAI API:", error);
    }
  };

  const [isOpenAIResponding, setIsOpenAIResponding] = useState(false);
  const handleChatWithChatbot = async () => {
    if (text.trim() === "" && pendingFile.length === 0) return;

    try {
      setIsOpenAIResponding(true);
      const res = await chatOpenaiAPI([{ role: "user", content: text.trim() }]);
      console.log("OpenAI response:", res);
      setText("");
      setConversation((prev) => [
        ...prev,
        {
          content: text.trim(),
          sender: {
            name: "Nguyễn Văn A",
            profilePic: "https://avatar.iran.liara.run/public/10.png",
            isRead: true,
          },
          timestamp: new Date().toISOString(),
          side: "right",
          files: [],
        },
        {
          content: res.reply,
          sender: {
            name: "Nguyễn Văn A",
            profilePic: "https://avatar.iran.liara.run/public/10.png",
            isRead: true,
          },
          timestamp: new Date().toISOString(),
          side: "left", // hoặc "right"
          files: [],
        },
      ]);

      // Clear form
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // Scroll
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsOpenAIResponding(false);
    }
  };

  return (
    <div
      className={`border-t border-base-300 flex flex-col gap-4 px-4 py-4 ${
        pendingFile.length > 0 ? "h-[193px]" : "h-20"
      }`}
    >
      {pendingFile.length > 0 && (
        <div className="flex-1 !overflow-x-scroll ml-[88px] mr-[56px] max-w-[calc(100vw-256px)] lg:max-w-[calc(100vw-432px)] flex items-end relative">
          {pendingFile.map((file, index) => (
            <div key={index} className={`${index !== 0 ? "ml-2" : ""}`}>
              {file.type.startsWith("image/") ? (
                <div>
                  <CostumedModal
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
                            handleRemoveFile(index);
                          }}
                          type="primary"
                        >
                          <X className="size-3" />
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
                </div>
              ) : file.type.startsWith("video/") ? (
                <CostumedModal
                  trigger={
                    <div className="relative h-[max-content] w-fit cursor-pointer group">
                      <video
                        src={file.url}
                        controls
                        className="h-24 min-w-40 !rounded-btn border border-base-300 bg-base-100 p-1"
                      />

                      <CommonRoundedButton
                        className="hidden group-hover:flex absolute top-1 right-1 cursor-pointer bg-primary/25 p-1 rounded-btn !size-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRemoveFile(index);
                        }}
                        type="primary"
                      >
                        <X className="size-3" />
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
              ) : (
                <div className="text-sm bg-base-100 border border-base-300 px-4 py-2 w-[200px] lg:w-auto lg:max-w-[360px] rounded-btn flex items-center gap-3 relative group">
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
                      handleRemoveFile(index);
                    }}
                    type="primary"
                  >
                    <X className="size-3" />
                  </CommonRoundedButton>
                </div>
              )}
            </div>
          ))}
          <div ref={lastFileInputRef} className="" />
        </div>
      )}

      <div
        className={`flex items-center justify-between gap-4 ${
          isOpenAIResponding ? "pointer-events-none" : ""
        }`}
      >
        {" "}
        {/* Utils */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
            // accept="image/*,video/*"
            style={{ display: "none" }}
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <CommonRoundedButton onClick={() => fileInputRef.current.click()}>
            <Paperclip className="size-4" />
          </CommonRoundedButton>

          {/* <MultiMediaSelect /> */}
          <CostumedEmojiPicker
            trigger={
              <CommonRoundedButton
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Smile className="size-4" />
              </CommonRoundedButton>
            }
            onEmojiClick={(emojiData) => handleEmojiSelect(emojiData)}
          />
        </div>
        {/* Input field */}
        <div className="w-full">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full text-sm"
          />
        </div>
        {/* Send button */}
        {isOpenAIResponding ? (
          <div
            className={`btn btn-primary size-10 p-0 min-w-0 min-h-0 rounded-full pointer-events-none  text-sm flex items-center justify-center hover:btn-secondary `}
          >
            <LoaderIcon className="animate-spin size-6" />
          </div>
        ) : (
          <div
            className={`btn btn-primary size-10 p-0 min-w-0 min-h-0 rounded-full cursor-pointer text-sm flex items-center justify-center hover:btn-secondary `}
            onClick={
              selectedUser.email == "chatbot@example.com"
                ? handleChatWithChatbot
                : handleSendMessage
            }
          >
            <Forward className="size-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
