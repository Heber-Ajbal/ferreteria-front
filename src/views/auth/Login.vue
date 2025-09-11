<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../lib/api";

const router = useRouter();
const route = useRoute();

const currentView = ref("login"); // login | register | dashboard
const formData = ref({ name: "", email: "", password: "" });
const errors = ref<Record<string, string | undefined>>({});
const currentUser = ref<{ email: string } | null>(null);

// 1) Intento de sesión persistida: si hay token, traigo /auth/me
onMounted(async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  try {
    const { data } = await api.get("/auth/profile"); // espera { id, email, role }
    currentUser.value = { email: data.email };
    currentView.value = "dashboard";
  } catch {
    localStorage.removeItem("accessToken");
  }
});

// Login real contra backend
async function handleLogin() {
  errors.value = {};
  try {
    const { data } = await api.post("/auth/login", {
      email: formData.value.email,
      password: formData.value.password,
    });

    localStorage.setItem("accessToken", data.accessToken);
    currentUser.value = { email: data.user.email };

    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);

  } catch (e: any) {
    errors.value = { general: e?.response?.data?.message || "Email o contraseña incorrectos" };
  }
}

// Registro (si ya tienes endpoint). Si no, déjalo como está o deshabilítalo.
async function handleRegister() {
  errors.value = {};

  if (!formData.value.email || !formData.value.password || !formData.value.name) {
    errors.value = { general: "Todos los campos son obligatorios" };
    return;
  }

  try {
    const { data } = await api.post("/auth/register", {
      fullName: formData.value.name,   // tu backend espera fullName
      email: formData.value.email,
      password: formData.value.password,
    });

    // data = { accessToken, user }
    localStorage.setItem("accessToken", data.accessToken);
    currentUser.value = { email: data.user.email };

    // redirigir al home (o a redirect si venías de una ruta protegida)
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (e: any) {
    const msg = e?.response?.data?.message || "No se pudo registrar";
    errors.value = { general: Array.isArray(msg) ? msg.join(", ") : msg };
  }
}


</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Efecto decorativo -->
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-10 left-10"
      ></div>
      <div
        class="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-20 right-10"
      ></div>
      <div
        class="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bottom-10 left-20"
      ></div>
    </div>

    <div
      class="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8 relative z-10 border border-gray-100"
    >
      <!-- Encabezado -->
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md"
        >
          <span class="text-3xl">🛠️</span>
        </div>
        <h2 class="mt-6 text-2xl font-extrabold text-gray-900">
          {{ currentView === "login"
            ? "Iniciar Sesión"
            : currentView === "register"
            ? "Crear Cuenta"
            : "Bienvenido" }}
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          {{ currentView === "login"
              ? "Accede a tu cuenta de Mi Ferretería"
              : currentView === "register"
              ? "Rellena el formulario para registrarte"
              : `Has iniciado sesión como ${currentUser?.email}` }}
        </p>
      </div>

      <!-- Formulario -->
      <form
        v-if="currentView !== 'dashboard'"
        class="mt-8 space-y-6"
        @submit.prevent="
          currentView === 'login' ? handleLogin() : handleRegister()
        "
      >
        <div class="space-y-4">
          <!-- Nombre (solo en registro) -->
          <div v-if="currentView === 'register'">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700"
              >Nombre completo</label
            >
            <div class="relative">
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Tu nombre"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">👤</span>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <div class="relative">
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="tu-email@ejemplo.com"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">📧</span>
            </div>
          </div>

          <!-- Contraseña -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Contraseña</label
            >
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                class="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Tu contraseña"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">🔒</span>
            </div>
          </div>
        </div>

        <!-- Errores -->
        <p
          v-if="errors.general"
          class="text-red-500 text-sm text-center mt-2"
        >
          {{ errors.general }}
        </p>

        <!-- Botón -->
        <div>
          <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition"
          >
            {{ currentView === "login" ? "Iniciar Sesión" : "Crear Cuenta" }}
          </button>
        </div>

        <!-- Cambiar vista -->
        <div class="text-center mt-4">
          <p v-if="currentView === 'login'" class="text-gray-600">
            ¿No tienes cuenta?
            <button
              type="button"
              class="text-blue-600 hover:underline font-medium"
              @click="currentView = 'register'"
            >
              Regístrate
            </button>
          </p>
          <p v-else class="text-gray-600">
            ¿Ya tienes cuenta?
            <button
              type="button"
              class="text-blue-600 hover:underline font-medium"
              @click="currentView = 'login'"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
/* Animación de blobs en el fondo */
@keyframes blob {
  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
.animate-blob {
  animation: blob 8s infinite;
}
</style>
