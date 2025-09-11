import { defineStore } from "pinia";
import api from "../lib/api";

interface User {
  id: number;
  email: string;
  role: "ADMIN" | "CLIENT";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("accessToken") || "",
    loading: false,
    error: "" as string | null,
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/auth/login", { email, password });
        this.token = data.accessToken;
        this.user = data.user;
        localStorage.setItem("accessToken", data.accessToken);
      } catch (e: any) {
        this.error = e?.response?.data?.message || "Error al iniciar sesión";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("accessToken");
    },
    async me() {
      // Si tienes un endpoint para obtener el usuario actual
      const { data } = await api.get("/auth/me");
      this.user = data;
    },
  },
});
