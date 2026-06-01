import axios from "axios";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

export const chatApi = {
  sendMessage: async (message: string, sessionId: string | null) => {
    const { data } = await client.post("/chat", { message, session_id: sessionId });
    return data;
  },
};

export const productsApi = {
  getAll: async (params?: {
    category?: string;
    skin_type?: string;
    max_price?: number;
  }) => {
    const { data } = await client.get("/products", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await client.get(`/products/${id}`);
    return data;
  },
};

export const routineApi = {
  generate: async (payload: {
    skin_type: string;
    concern: string;
    budget?: number;
  }) => {
    const { data } = await client.post("/routine", payload);
    return data;
  },
};

export const memoryApi = {
  getSession: async (sessionId: string) => {
    const { data } = await client.get(`/memory/${sessionId}`);
    return data;
  },
  clearSession: async (sessionId: string) => {
    await client.delete(`/memory/${sessionId}`);
  },
};
