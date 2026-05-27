import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { chatApi } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ProductCard[];
  timestamp: Date;
  isTyping?: boolean;
}

export interface ProductCard {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  skin_type: string;
  concern: string;
  image_url: string;
  product_url?: string;
  match_reason?: string;
}

export interface UserProfile {
  skin_type?: string;
  concerns?: string[];
  budget?: number;
}

interface ChatStore {
  sessionId: string | null;
  messages: Message[];
  products: ProductCard[];
  profile: UserProfile;
  isLoading: boolean;
  isChatOpen: boolean;

  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearSession: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessionId: null,
  messages: [],
  products: [],
  profile: {},
  isLoading: false,
  isChatOpen: false,

  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),

  sendMessage: async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const typingMsg: Message = {
      id: "typing",
      role: "assistant",
      content: "",
      isTyping: true,
      timestamp: new Date(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg, typingMsg],
      isLoading: true,
    }));

    try {
      const data = await chatApi.sendMessage(text, get().sessionId);

      const aiMsg: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.message,
        products: data.products,
        timestamp: new Date(),
      };

      set((s) => ({
        sessionId: data.session_id,
        messages: [...s.messages.filter((m) => m.id !== "typing"), aiMsg],
        products: data.products?.length ? data.products : s.products,
        profile: data.profile || s.profile,
        isLoading: false,
      }));
    } catch (err) {
      set((s) => ({
        messages: [
          ...s.messages.filter((m) => m.id !== "typing"),
          {
            id: uuidv4(),
            role: "assistant",
            content: "Something went wrong — please try again ✨",
            timestamp: new Date(),
          },
        ],
        isLoading: false,
      }));
    }
  },

  clearSession: () =>
    set({ sessionId: null, messages: [], products: [], profile: {} }),
}));
