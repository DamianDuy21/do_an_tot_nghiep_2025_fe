import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router";

import MainLayout from "./layouts/MainLayout.jsx";

import { useEffect } from "react";
import CommonPageLoader from "./components/loaders/CommonPageLoader.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import ChatsPage from "./pages/ChatsPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useThemeStore } from "./stores/useThemeStore.js";

const App = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const checkAuthAuthStore = useAuthStore((s) => s.checkAuthAuthStore);
  const isGettingAuthUser = useAuthStore((s) => s.isGettingAuthUser);

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);

  const isOnboarding = authUser?.isOnboarded;

  useEffect(() => {
    checkAuthAuthStore();
  }, [checkAuthAuthStore]);

  if (isGettingAuthUser) {
    return <CommonPageLoader />;
  }

  return (
    <>
      <div className="min-h-screen " data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <HomePage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/chats"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <ChatsPage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/call/:id"
            element={
              isAuthenticated && isOnboarding ? (
                <></>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/friends"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <FriendsPage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              isAuthenticated && isOnboarding ? (
                <MainLayout>
                  <ChangePasswordPage />
                </MainLayout>
              ) : (
                <Navigate to={!isAuthenticated ? "/signin" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                !isOnboarding ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to={"/"} />
                )
              ) : (
                <Navigate to={"/signin"} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUpPage />
              ) : (
                <Navigate to={!isOnboarding ? "/onboarding" : "/"} />
              )
            }
          />
          <Route
            path="/signin"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to={!isOnboarding ? "/onboarding" : "/"} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              !isAuthenticated ? (
                <ForgotPasswordPage />
              ) : (
                <Navigate to={!isOnboarding ? "/onboarding" : "/"} />
              )
            }
          />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
              minHeight: "48px",
              padding: "8px 16px",
            },
          }}
          gutter={8}
        />
      </div>
    </>
  );
};

export default App;
