import Cookies from "js-cookie";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAuthUserAPI, loginAPI, logoutAPI } from "../lib/api.js";
import { io } from "socket.io-client";

const BASE_URI = "http://localhost:8888";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ---------- STATE ----------
      authUser: null,
      onlineUsers: [],
      socket: null,

      isGettingAuthUser: false,

      hydrated: false,

      // ---------- ACTIONS ----------
      setAuthUser: (user) => set({ authUser: user }),

      signInAuthStore: async (loginData) => {
        try {
          await loginAPI(loginData);
          const res = await getAuthUserAPI();
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          console.error("Error signing in:", error);
          throw error;
        }
      },

      logoutAuthStore: async (options = {}) => {
        try {
          if (!options.skipRemote) {
            await logoutAPI();
          }
        } catch (err) {
          console.error("Error logging out:", err);
        } finally {
          set({ authUser: null });
          Cookies.remove("jwt");
          get().disconnectSocket();
        }
      },

      checkAuthAuthStore: async () => {
        try {
          set({ isGettingAuthUser: true });
          const res = await getAuthUserAPI();
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          set({ authUser: null });
          Cookies.remove("jwt");
          console.error("Error checking authentication:", error);
        } finally {
          set({ isGettingAuthUser: false });
        }
      },

      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser?.isOnboarded || !authUser || socket?.connected) return;
        const s = io(BASE_URI, {
          path: "/",
          query: {
            token:
              "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sImlkIjoxLCJlbWFpbCI6ImZha2VVc2VyMEBnbWFpbC5jb20iLCJpYXQiOjE3NTgwMzc1MzEsImV4cCI6MjExODAzNzUzMX0.xpiHFsx2JEMtLCyYBMlSYAA4I6bzApKzYfUxlimI9PE",
          },
        });
        s.connect();
        set({ socket: s });
        s.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
      },

      disconnectSocket: () => {
        if (get().socket?.connected) {
          get().socket.disconnect();
          set({ socket: null });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        authUser: state.authUser,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth store rehydrate error:", error);
        }

        queueMicrotask(() => {
          try {
            const { authUser, connectSocket } = useAuthStore.getState();
            useAuthStore.setState({ hydrated: true });

            if (authUser) {
              connectSocket();
            }
          } catch (e) {
            console.error("Post-hydrate hook failed:", e);
          }
        });
      },

      version: 1,
    }
  )
);
