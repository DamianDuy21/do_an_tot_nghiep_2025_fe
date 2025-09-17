import {
  Badge,
  BellIcon,
  Hexagon,
  MessageCircle,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";

const Sidebar = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const { t } = useTranslation("sidebar");
  const location = useLocation();
  const currentPath = location.pathname;

  const isChatPage = location.pathname?.startsWith("/chat");
  const isProfilePage = location.pathname?.startsWith("/profile");
  const isChangePasswordPage =
    location.pathname?.startsWith("/change-password");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <aside className="w-20 lg:w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen sticky top-0">
        <div className="w-full px-4 lg:px-8 h-16 border-b border-base-300 flex items-center justify-center lg:justify-start">
          {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
            windowWidth > 1024 ? (
              <div className="relative -left-[2px]">
                <Link to="/" className="flex items-center gap-2.5">
                  <Hexagon className="size-6 text-primary" />
                  <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                    Chatify
                  </span>
                </Link>
              </div>
            ) : (
              <div className="">
                <Link to="/" className="flex items-center gap-2.5">
                  <Hexagon className="size-8 text-primary" />
                </Link>
              </div>
            )
          ) : null}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/"
            className={`btn btn-ghost flex justify-center items-center lg:justify-start w-full px-0 lg:gap-4 lg:px-4 normal-case  ${
              currentPath === "/" ? "btn-active" : "hover:bg-base-300"
            }`}
          >
            <Badge className="!size-5 text-base-content opacity-70" />
            {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
              <span className="hidden lg:block">{t("pages.home")}</span>
            ) : null}
          </Link>
          <Link
            to="/friends"
            className={`btn btn-ghost flex justify-center items-center lg:justify-start w-full px-0 lg:gap-4 lg:px-4 normal-case ${
              currentPath === "/friends" ? "btn-active" : "hover:bg-base-300"
            }`}
          >
            {/* <UsersRound /> */}
            <UsersRound className="size-5 text-base-content opacity-70" />
            {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
              <span className="hidden lg:block">{t("pages.friends")}</span>
            ) : null}
          </Link>
          <Link
            to="/chats"
            className={`relative btn btn-ghost flex justify-center items-center lg:justify-start w-full px-0 lg:gap-4 lg:px-4 normal-case ${
              currentPath === "/chats" ? "btn-active" : "hover:bg-base-300"
            }`}
          >
            <MessageCircle className="size-5 text-base-content opacity-70" />
            {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
              <span className="hidden lg:block">{t("pages.chats")}</span>
            ) : null}
            <div className="absolute right-1 -top-0 lg:right-4 lg:top-1/2 lg:transform lg:-translate-y-1/2">
              <span className="size-2 rounded-full bg-primary inline-block opacity-100" />
            </div>
          </Link>
          <Link
            to="/notifications"
            className={`relative btn btn-ghost flex justify-center items-center lg:justify-start w-full px-0 lg:gap-4 lg:px-4 normal-case ${
              currentPath === "/notifications"
                ? "btn-active"
                : "hover:bg-base-300"
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
              <span className="hidden lg:block">
                {t("pages.notifications")}
              </span>
            ) : null}
            {/* <div className="absolute right-1 -top-0 lg:right-4 lg:top-1/2 lg:transform lg:-translate-y-1/2">
              <span className="size-2 rounded-full bg-primary inline-block opacity-100" />
            </div> */}
          </Link>
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="h-16 border-t border-base-300 mt-auto flex items-center justify-center lg:justify-start px-4">
          <div className="flex items-center gap-3 relative">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.profilePic ||
                    "https://avatar.iran.liara.run/public/20.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="absolute -right-0 -bottom-0 lg:hidden">
              <span className="size-2 rounded-full bg-success inline-block" />
            </div>
            {!isProfilePage && !isChatPage && !isChangePasswordPage ? (
              <div className="hidden lg:block">
                <p className="font-semibold text-sm">{authUser?.fullName}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="size-2 rounded-full bg-success inline-block" />
                  {t("user.status.online")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
