import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { showToast } from "../components/costumed/CostumedToast.jsx";

import CommonRoundedButton from "../components/buttons/CommonRoundedButton.jsx";
import FriendCard_ChatsPage_Sidebar from "../components/cards/FriendCard_ChatsPage_Sidebar.jsx";
import ChatWindow from "../components/chats/ChatWindow.jsx";
import CostumedDebounceInput from "../components/costumed/CostumedDebounceInput.jsx";
import NoChatSelected from "../components/noFounds/NoChatSelected.jsx";

import { getLearningLanguagesAPI, getNativeLanguagesAPI } from "../lib/api.js";
import NoDataCommon from "../components/noFounds/NoDataCommon.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const ChatsPage = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const socket = useAuthStore((s) => s.socket);
  const onlineUsers = useAuthStore((s) => s.onlineUsers);
  const { t } = useTranslation("profilePage");
  const [
    isOpenSearchFriendsInSmallScreen,
    setIsOpenSearchFriendsInSmallScreen,
  ] = useState(false);

  const unseenMessages = useChatStore((s) => s.unseenMessages);
  const users = useChatStore((s) => s.users);
  const getUsers = useChatStore((s) => s.getUsers);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const setSelectedUser = useChatStore((s) => s.setSelectedUser);
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore(
    (s) => s.unsubscribeFromMessages
  );

  const [friends, setFriends] = useState([
    {
      id: 1,
      fullName: "Alice Nguyễn",
      email: "alice@example.com",
      password: "password123",
      bio: "Yêu thích học ngôn ngữ và du lịch.",
      profilePic: "https://avatar.iran.liara.run/public/20.png",
      nativeLanguage: "Vietnamese",
      learningLanguage: "English",
      location: "Hà Nội",
      isOnboarded: true,
      isOnline: true,
      unReadMessages: 5,
    },
    {
      id: 2,
      fullName: "Carlos Silva",
      email: "carlos@example.com",
      password: "securepass",
      bio: "Tôi đang học tiếng Việt để du lịch Đông Nam Á aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.",
      profilePic: "https://avatar.iran.liara.run/public/21.png",
      nativeLanguage: "Portuguese",
      learningLanguage: "Vietnamese",
      location: "Lisbon",
      isOnboarded: true,
      isOnline: false,
      unReadMessages: 2,
    },
    {
      id: 3,
      fullName: "John Miller",
      email: "john@example.com",
      password: "johnmiller321",
      bio: "Ngôn ngữ là cầu nối giữa các nền văn hóa.",
      profilePic: "https://avatar.iran.liara.run/public/02.png",
      nativeLanguage: "English",
      learningLanguage: "Vietnamese",
      location: "New York",
      isOnboarded: true,
      isOnline: false,
      unReadMessages: 0,
    },
    {
      id: 4,
      fullName: "Linh Trần",
      email: "linhtran@example.com",
      password: "tranlinh456",
      bio: "Đam mê viết lách và học tiếng Nhật.",
      profilePic: "https://avatar.iran.liara.run/public/12.png",
      nativeLanguage: "Vietnamese",
      learningLanguage: "Japanese",
      location: "Đà Nẵng",
      isOnboarded: true,
      isOnline: true,
    },
    {
      id: 5,
      fullName: "Emma Dupont",
      email: "emma@example.com",
      password: "bonjour123",
      bio: "J'adore apprendre les langues et cuisiner.",
      profilePic: "https://avatar.iran.liara.run/public/04.png",
      nativeLanguage: "French",
      learningLanguage: "Vietnamese",
      location: "Paris",
      isOnboarded: true,
      isOnline: false,
    },
    {
      id: 6,
      fullName: "Minh Lê",
      email: "minhle@example.com",
      password: "12345678",
      bio: "Tôi muốn nâng cao khả năng giao tiếp tiếng Anh.",
      profilePic: "https://avatar.iran.liara.run/public/07.png",
      nativeLanguage: "Vietnamese",
      learningLanguage: "English",
      location: "Cần Thơ",
      isOnboarded: true,
      isOnline: true,
    },
    {
      id: 7,
      fullName: "Sara Kim",
      email: "sarakim@example.com",
      password: "korea2024",
      bio: "한국어는 제 모국어이고, 저는 베트남어를 배우고 있어요.",
      profilePic: "https://avatar.iran.liara.run/public/17.png",
      nativeLanguage: "Korean",
      learningLanguage: "Vietnamese",
      location: "Seoul",
      isOnboarded: true,
      isOnline: false,
    },
    {
      id: 8,
      fullName: "Ngọc Bích",
      email: "bichngoc@example.com",
      password: "ngoc123",
      bio: "Mình muốn học tiếng Hàn để xem phim không cần phụ đề!",
      profilePic: "https://avatar.iran.liara.run/public/10.png",
      nativeLanguage: "Vietnamese",
      learningLanguage: "Korean",
      location: "Hải Phòng",
      isOnboarded: true,
      isOnline: true,
    },
    {
      id: 9,
      fullName: "David Garcia",
      email: "davidg@example.com",
      password: "spanishlover",
      bio: "Aprendo vietnamita para viajar a Asia.",
      profilePic: "https://avatar.iran.liara.run/public/15.png",
      nativeLanguage: "Spanish",
      learningLanguage: "Vietnamese",
      location: "Madrid",
      isOnboarded: true,
      isOnline: false,
    },
    {
      id: 10,
      fullName: "Mai Phương",
      email: "maiphuong@example.com",
      password: "phuongmai",
      bio: "Mình đang luyện tiếng Anh để đi du học.",
      profilePic: "https://avatar.iran.liara.run/public/19.png",
      nativeLanguage: "Vietnamese",
      learningLanguage: "English",
      location: "Hồ Chí Minh",
      isOnboarded: true,
      isOnline: true,
    },
  ]);

  const [displayedFriends, setDisplayedFriends] = useState(friends);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage.name || "",
    learningLanguage: authUser?.learningLanguage.name || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
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

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 10) + 1; // 1-10 included
    const randomAvatar = `/images/avatar/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    showToast({
      message: "Random avatar generated successfully!",
      type: "success",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onboardingMutation(formState);
  };

  useEffect(() => {
    getNativeLanguagesMutation();
    getLearningLanguagesMutation();
  }, []);

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, onlineUsers]);
  // lấy onlineUsers từ authStore nhé

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 1024) {
        setIsOpenSearchFriendsInSmallScreen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setDisplayedFriends(friends);
    console.log("Friends updated:", friends);
  }, [friends]);

  useEffect(() => {
    setFriends(users);
  }, [users]);

  useEffect(() => {
    if (!socket) return;
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  return (
    <>
      {/* p-4 sm:p-6 lg:p-6  */}
      <div className="min-h-[calc(100vh-64px)] relative flex">
        <div
          className={`${
            friends.length === 0 ? "hidden" : ""
          } w-20 lg:w-64 bg-base-200 border-r border-base-300 flex flex-col h-[calc(100vh-64px)] ${
            isOpenSearchFriendsInSmallScreen
              ? "!w-64 absolute top-0 left-0 z-50"
              : ""
          }`}
        >
          {friends.length > 0 ? (
            <div className="h-16 px-4 flex items-center justify-center gap-4 border-b border-base-300">
              <div
                className={`hidden lg:block w-full ${
                  isOpenSearchFriendsInSmallScreen ? "!block" : ""
                }`}
              >
                <CostumedDebounceInput
                  name="searchFriends"
                  placeholder={"Tìm kiếm bạn bè"}
                  className={`input-sm `}
                  iconClassName={`!right-3`}
                  onChange={(value) => {
                    const filteredFriends = friends.filter((friend) =>
                      friend.fullName
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    );
                    setDisplayedFriends(filteredFriends);
                  }}
                />
              </div>
              {!isOpenSearchFriendsInSmallScreen ? (
                <CommonRoundedButton
                  onClick={() => {
                    //   setIsOpenFilter(true);
                    setIsOpenSearchFriendsInSmallScreen(true);
                  }}
                  className={"flex lg:hidden"}
                >
                  <ChevronRight className="size-4" />
                </CommonRoundedButton>
              ) : (
                <CommonRoundedButton
                  onClick={() => {
                    //   setIsOpenFilter(true);
                    setIsOpenSearchFriendsInSmallScreen(false);
                  }}
                  className={"flex lg:hidden"}
                >
                  <ChevronLeft className="size-4" />
                </CommonRoundedButton>
              )}
            </div>
          ) : null}

          {friends.length > 0 && (
            <>
              {displayedFriends.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                  {displayedFriends.map((friend, index) => (
                    <FriendCard_ChatsPage_Sidebar
                      key={index}
                      userKey={index}
                      friend={friend}
                      selectedId={selectedUser?.id}
                      onClick={(friend) => {
                        setSelectedUser(friend);
                        setIsOpenSearchFriendsInSmallScreen(false);
                      }}
                      isShowAll={isOpenSearchFriendsInSmallScreen}
                      unseenMessages={unseenMessages[friend.id] || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <NoDataCommon
                    title={"Không tìm thấy bạn bè"}
                    content={"Thử tìm kiếm với từ khóa khác."}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`flex-1 ${
            isOpenSearchFriendsInSmallScreen ? "ml-20" : ""
          }`}
        >
          {selectedUser ? (
            <ChatWindow user={selectedUser} onClick={setSelectedUser} />
          ) : (
            <div className="p-16 flex items-center justify-center h-full">
              <NoChatSelected
                hasFriends={friends.length > 0}
                onClick={() => {
                  const chatbot = friends.find(
                    (friend) => friend.fullName === "Chat bot"
                  );
                  if (chatbot) {
                    setSelectedUser(chatbot);
                  } else {
                    const chatbot = {
                      id: 0,
                      fullName: "Chat bot",
                      email: "chatbot@example.com",
                      password: "password123",
                      bio: "Yêu thích học ngôn ngữ và du lịch.",
                      profilePic:
                        "https://avatar.iran.liara.run/public/100.png",
                      nativeLanguage: "Vietnamese",
                      learningLanguage: "English",
                      location: "Hà Nội",
                      isOnboarded: true,
                      isOnline: true,
                      unReadMessages: 5,
                    };
                    setSelectedUser(chatbot);
                    setFriends((prevFriends) => [chatbot, ...prevFriends]);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatsPage;
