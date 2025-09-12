<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../lib/api";

const router = useRouter();
const route = useRoute();

const currentView = ref<"login" | "register" | "dashboard">("login");
const formData = ref({ name: "", email: "", password: "" });
const errors = ref<Record<string, string | undefined>>({});
const currentUser = ref<{ email: string } | null>(null);

const loading = ref(false);
const showPassword = ref(false);

onMounted(async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  try {
    const { data } = await api.get("/auth/profile");
    currentUser.value = { email: data.email };
    currentView.value = "dashboard";
  } catch {
    localStorage.removeItem("accessToken");
  }
});

const isLogin = computed(() => currentView.value === "login");
const canSubmit = computed(() => {
  if (isLogin.value) return !!formData.value.email && !!formData.value.password && !loading.value;
  return !!formData.value.name && !!formData.value.email && !!formData.value.password && !loading.value;
});

function validateBasics() {
  errors.value = {};
  if (!formData.value.email) errors.value.email = "El email es obligatorio";
  if (!formData.value.password) errors.value.password = "La contraseña es obligatoria";
  if (!isLogin.value && !formData.value.name) errors.value.name = "El nombre es obligatorio";
  return Object.keys(errors.value).length === 0;
}

async function handleLogin() {
  if (!validateBasics()) return;
  loading.value = true;
  errors.value.general = undefined;
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
    errors.value.general = e?.response?.data?.message || "Email o contraseña incorrectos";
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  if (!validateBasics()) return;
  loading.value = true;
  errors.value.general = undefined;
  try {
    const { data } = await api.post("/auth/register", {
      fullName: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    });
    localStorage.setItem("accessToken", data.accessToken);
    currentUser.value = { email: data.user.email };
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (e: any) {
    const msg = e?.response?.data?.message || "No se pudo registrar";
    errors.value.general = Array.isArray(msg) ? msg.join(", ") : msg;
  } finally {
    loading.value = false;
  }
}

function submit() {
  if (isLogin.value) return handleLogin();
  return handleRegister();
}
</script>

<template>
  <!-- background sutil -->
  <div class="min-h-screen grid place-items-center px-4 py-10 bg-[radial-gradient(70%_90%_at_50%_-20%,_theme(colors.slate.50),_theme(colors.slate.100))]">
    <!-- Card -->
    <div class="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.08)]">
      <div class="grid md:grid-cols-5">
        <!-- Panel branding (sutil, no saturado) -->
        <aside class="hidden md:flex md:col-span-2 flex-col justify-between p-8 bg-gradient-to-br from-slate-50 to-indigo-50 border-r border-slate-200">
          <div>
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white grid place-items-center shadow">
              <!-- logo -->
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 7l10 10M17 7L7 17"></path>
              </svg>
            </div>
            <h2 class="mt-6 text-2xl font-extrabold text-slate-900 leading-tight">Ferretería El Tornillo Feliz</h2>
            <p class="mt-2 text-sm text-slate-600">Compra segura, rápida y con la mejor atención.</p>
          </div>

          <ul class="mt-8 space-y-3 text-sm text-slate-700">
            <li class="flex items-center gap-3">
              <span class="h-8 w-8 rounded-lg bg-white text-emerald-600 grid place-items-center border border-emerald-200">
                <!-- check -->
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </span>
              Carrito y pagos protegidos
            </li>
            <li class="flex items-center gap-3">
              <span class="h-8 w-8 rounded-lg bg-white text-indigo-600 grid place-items-center border border-indigo-200">
                <!-- truck -->
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 16V6h11v10"></path>
                  <path d="M14 8h4l3 3v5h-7z"></path>
                  <circle cx="7.5" cy="17.5" r="1.5"></circle>
                  <circle cx="17.5" cy="17.5" r="1.5"></circle>
                </svg>
              </span>
              Envíos a todo el país
            </li>
            <li class="flex items-center gap-3">
              <span class="h-8 w-8 rounded-lg bg-white text-sky-600 grid place-items-center border border-sky-200">
                <!-- chat -->
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                </svg>
              </span>
              Soporte por chat y correo
            </li>
          </ul>

          <p class="text-xs text-slate-500">© {{ new Date().getFullYear() }} El Tornillo Feliz</p>
        </aside>

        <!-- Formulario -->
        <section class="md:col-span-3 p-6 sm:p-8">
          <!-- Tabs -->
          <div class="flex items-center justify-between">
            <div class="inline-flex p-1 rounded-xl bg-slate-50 border border-slate-200">
              <button
                type="button"
                class="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition"
                :class="isLogin ? 'bg-white shadow border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'"
                @click="currentView = 'login'">
                Iniciar Sesión
              </button>
              <button
                type="button"
                class="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition"
                :class="!isLogin ? 'bg-white shadow border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'"
                @click="currentView = 'register'">
                Crear Cuenta
              </button>
            </div>
            <div class="md:hidden h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white grid place-items-center shadow">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 7l10 10M17 7L7 17"></path>
              </svg>
            </div>
          </div>

          <!-- Headings -->
          <div class="mt-6">
            <h1 class="text-xl font-semibold text-slate-900">
              {{ isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta" }}
            </h1>
            <p class="mt-1 text-sm text-slate-600">
              {{ isLogin ? "Ingresa tus datos para continuar" : "Rellena el formulario para registrarte" }}
            </p>
          </div>

          <!-- FORM -->
          <form class="mt-6 space-y-5" @submit.prevent="submit" v-if="currentView !== 'dashboard'">
            <!-- Nombre -->
            <div v-if="!isLogin">
              <label for="name" class="block text-sm font-medium text-slate-700">Nombre completo</label>
              <div class="relative mt-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                </div>
                <input
                  id="name"
                  v-model.trim="formData.name"
                  type="text"
                  autocomplete="name"
                  required
                  :aria-invalid="!!errors.name"
                  class="block w-full h-11 rounded-xl border border-slate-300 bg-white/95 pl-11 pr-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                  :class="errors.name && 'border-red-400'"
                  placeholder="Tu nombre"/>
              </div>
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
              <div class="relative mt-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">

                </div>
                <input
                  id="email"
                  v-model.trim="formData.email"
                  type="email"
                  :autocomplete="isLogin ? 'email' : 'new-email'"
                  required
                  :aria-invalid="!!errors.email"
                  class="block w-full h-11 rounded-xl border border-slate-300 bg-white/95 pl-11 pr-3 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                  :class="errors.email && 'border-red-400'"
                  placeholder="mail@ejemplo.com"/>
              </div>
              <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
              <div class="relative mt-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  required
                  :aria-invalid="!!errors.password"
                  class="block w-full h-11 rounded-xl border border-slate-300 bg-white/95 pl-11 pr-24 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                  :class="errors.password && 'border-red-400'"
                  placeholder="••••••••"/>
                <!-- botón ver/ocultar -->
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-xs px-2.5 py-1.5 my-1 rounded-md border border-slate-300 bg-white/70 hover:bg-slate-50"
                  @click="showPassword = !showPassword">
                  <span class="inline-flex items-center gap-1">
                    <svg v-if="!showPassword" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M3 3l18 18"></path>
                      <path d="M2 12s4-7 10-7c2.2 0 4.1.7 5.7 1.7M22 12s-4 7-10 7c-2.2 0-4.1-.7-5.7-1.7"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {{ showPassword ? 'Ocultar' : 'Ver' }}
                  </span>
                </button>
              </div>
              <div v-if="isLogin" class="mt-2 text-right">
                <a href="#" class="text-sm text-slate-600 hover:text-slate-900 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
            </div>

            <!-- error general -->
            <p v-if="errors.general" class="text-red-600 text-sm text-center">{{ errors.general }}</p>

            <!-- Submit -->
            <div class="pt-1">
              <button
                type="submit"
                :disabled="!canSubmit"
                class="w-full h-11 rounded-xl bg-slate-900 text-white font-medium shadow-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300">
                <span v-if="!loading">{{ isLogin ? "Iniciar Sesión" : "Crear Cuenta" }}</span>
                <span v-else class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                    <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                  </svg>
                  Procesando…
                </span>
              </button>
            </div>

            <!-- switch -->
            <p class="text-center text-sm text-slate-600">
              <template v-if="isLogin">
                ¿No tienes cuenta?
                <button type="button" class="text-indigo-600 hover:underline font-medium" @click="currentView = 'register'">Crear cuenta</button>
              </template>
              <template v-else>
                ¿Ya tienes cuenta?
                <button type="button" class="text-indigo-600 hover:underline font-medium" @click="currentView = 'login'">Inicia sesión</button>
              </template>
            </p>
          </form>

          <!-- Dashboard si hay sesión -->
          <div v-else class="rounded-xl border border-slate-200 p-4 bg-white/70">
            <p class="text-slate-700">
              Has iniciado sesión como <span class="font-semibold">{{ currentUser?.email }}</span>.
            </p>
            <div class="mt-4">
              <button class="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-black transition" @click="router.push('/')">
                Ir al inicio
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes blob {
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(22px,-28px) scale(1.05); }
  66% { transform: translate(-16px,16px) scale(0.97); }
}
</style>
