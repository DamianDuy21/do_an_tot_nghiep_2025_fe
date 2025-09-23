import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  unseenMessages: {},

  testChat_ChatStore: async () => {
    try {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.emit("testChat", { data: "Hello from client" });
    } catch (error) {
      console.error("Failed to test chat:", error);
    }
  },

  getMessages: async (id) => {
    try {
      set({ messages: [] });

      const { data } = await axiosInstance.get(`/message/${id}`);
      set({ messages: data.data.messages });
      set((state) => ({
        unseenMessages: {
          ...state.unseenMessages,
          [id == "68947336c8a2e0e2c3d17211"
            ? "68947326c8a2e0e2c3d1720e"
            : "68947336c8a2e0e2c3d17211"]: 0,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log("Sending message to:", selectedUser, messageData);
    try {
      const { data } = await axiosInstance.post(
        `/message/send/${selectedUser.id}`,
        messageData
      );

      console.log("Message sent:", data);

      set({ messages: [...messages, data.data] });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  subscribeToMessages: () => {
    // const { selectedUser } = get();
    // const { socket } = useAuthStore.getState();
    // if (!socket) return;
    // socket.on("newMessage", async (newMessage) => {
    //   if (!selectedUser) {
    //     console.warn("No selected user to handle new message");
    //     console.log("New message received:", newMessage);
    //     set((state) => ({
    //       unseenMessages: {
    //         ...state.unseenMessages,
    //         [newMessage.senderId]:
    //           (state.unseenMessages?.[newMessage.senderId] || 0) + 1,
    //       },
    //     }));
    //     return;
    //   }
    //   const isMessageSentFromSelectedUser =
    //     newMessage.senderId === selectedUser.id;
    //   if (!isMessageSentFromSelectedUser) {
    //     set((state) => ({
    //       unseenMessages: {
    //         ...state.unseenMessages,
    //         [newMessage.senderId]:
    //           (state.unseenMessages?.[newMessage.senderId] || 0) + 1,
    //       },
    //     }));
    //   } else {
    //     newMessage.seen = true;
    //     set((state) => ({
    //       messages: [...state.messages, newMessage],
    //     }));
    //     try {
    //       await axiosInstance.put(`/message/mark/${newMessage.id}`);
    //     } catch (error) {
    //       console.error("Failed to mark message as seen", error);
    //     }
    //   }
    // });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  subscribeToChat: async () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("test", async (data) => {
      console.log("New message received:", data);
    });
  },
  unsubscribeFromChat: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("test");
  },
}));
