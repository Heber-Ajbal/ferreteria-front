// stores/auth.ts
import { defineStore } from "pinia";
import api from "../lib/api";

interface UserFromApi {
  userId: number;          // 👈 viene como userId
  email: string;
  roles: string[];         // 👈 viene como array de roles
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserFromApi | null,
    token: localStorage.getItem("accessToken") || "",
    loading: false,
    error: "" as string | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    isAdmin:   (s) => !!s.user?.roles?.includes("ADMIN"), // 👈 ahora mira el array
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/auth/login", { email, password });
        // data: { accessToken, user: { userId, email, roles: [...] } }
        this.token = data.accessToken;
        this.user  = data.user as UserFromApi;
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
      // Debe devolver { userId, email, roles: [...] }
      const { data } = await api.get("/auth/profile");
      this.user = data as UserFromApi;
    },
    async ensureSession() {
      // 1) token desde storage si no está en memoria
      if (!this.token) {
        const t = localStorage.getItem("accessToken");
        if (t) this.token = t;
      }
      // 2) si hay token pero no user, intenta recuperar
      if (this.token && !this.user) {
        try {
          await this.me();
        } catch {
          this.logout();
        }
      }
    },
  },
});
