import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type Role = "admin" | "customer" | "employee";
export type User = { email: string; role: Role; name?: string };

const KEY = "user";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  // Cargar de localStorage
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) user.value = JSON.parse(raw);
  } catch (e) {
    // ignora
  }

  function persist() {
    if (user.value) localStorage.setItem(KEY, JSON.stringify(user.value));
    else localStorage.removeItem(KEY);
  }

  function login(email: string, password: string, name?: string, roleHint?: Role) {
    // Demostración: si es admin@example.com + 1234 => admin, si no => customer
    let role: Role = "customer";
    if ((email === "admin@example.com" || roleHint === "admin") && password === "1234") {
      role = "admin";
    } else if (roleHint === "employee") {
      role = "employee";
    }
    user.value = { email, role, name };
    persist();
  }

  function register(name: string, email: string, password: string) {
    // Demo: registrar como customer y login inmediato
    user.value = { email, role: "customer", name };
    persist();
  }

  function logout() {
    user.value = null;
    persist();
  }

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  return { user, login, register, logout, isAuthenticated, isAdmin };




  import { defineStore } from 'pinia';

interface User {
  id: number;
  nombre: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  getters: {
    isLogged: (state) => !!state.user
  },
  actions: {
    login(nombre: string) {
      this.user = { id: 1, nombre };
    },
    logout() {
      this.user = null;
    }
  }
});

});
