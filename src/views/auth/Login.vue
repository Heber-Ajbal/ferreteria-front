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

      <!-- Dashboard -->
      <div v-else class="text-center space-y-6">
        <div class="p-6 bg-gray-50 rounded-xl shadow-inner">
          <p class="text-gray-700">
            ¡Hola <strong>{{ currentUser.email }}</strong>! Has iniciado sesión
            correctamente.
          </p>
        </div>
        <button
          @click="handleLogout"
          class="w-full py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 shadow-md transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const currentView = ref("login"); // login | register | dashboard
const formData = ref({ name: "", email: "", password: "" });
const errors = ref({});
const currentUser = ref(null);

// Usuarios de prueba
const testUsers = [
  { email: "admin@example.com", password: "1234" },
  { email: "empleado@example.com", password: "1234" },
  { email: "cliente@example.com", password: "1234" },
];

// Login
function handleLogin() {
  const user = testUsers.find(
    (u) =>
      u.email === formData.value.email &&
      u.password === formData.value.password
  );
  if (user) {
    currentUser.value = user;
    currentView.value = "dashboard";
    errors.value = {};
  } else {
    errors.value = { general: "Email o contraseña incorrectos" };
  }
}

// Registro
function handleRegister() {
  if (!formData.value.email || !formData.value.password || !formData.value.name) {
    errors.value = { general: "Todos los campos son obligatorios" };
    return;
  }
  const newUser = {
    email: formData.value.email,
    password: formData.value.password,
    name: formData.value.name,
  };
  currentUser.value = newUser;
  currentView.value = "dashboard";
  errors.value = {};
}

// Logout
function handleLogout() {
  currentUser.value = null;
  formData.value = { name: "", email: "", password: "" };
  currentView.value = "login";
}
</script>

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
