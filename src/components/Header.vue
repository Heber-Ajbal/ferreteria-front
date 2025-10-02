<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const cart = useCartStore();
const { count } = storeToRefs(cart);

const open = ref(false);

// util: clases base para links
const baseLink =
  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition";
const variants = {
  pink:   { base: "text-black bg-pink-300 hover:bg-pink-400 hover:text-white",   active:"!bg-pink-500 !text-white" },
  yellow: { base: "text-black bg-yellow-300 hover:bg-yellow-400 hover:text-white", active:"!bg-yellow-500 !text-white" },
  blue:   { base: "text-black bg-blue-300 hover:bg-blue-400 hover:text-white",   active:"!bg-blue-500 !text-white" },
  teal:   { base: "text-black bg-teal-300 hover:bg-teal-400 hover:text-white",   active:"!bg-teal-500 !text-white" },
  green:  { base: "text-black bg-green-300 hover:bg-green-400 hover:text-white", active:"!bg-green-500 !text-white" },
  red:    { base: "bg-red-300 hover:bg-red-400 hover:text-white",                active:"!bg-red-500 !text-white" },
  purple: { base: "text-black bg-purple-300 hover:bg-purple-400 hover:text-white", active:"!bg-purple-500 !text-white" },
};
</script>

<template>
  <header class="sticky top-0 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-pink-200/40 via-yellow-200/40 to-green-200/40 backdrop-blur-xl pointer-events-none"></div>
    <div class="absolute inset-0 bg-white/80 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 pointer-events-none"></div>

    <div class="relative mx-auto max-w-7xl px-4">
      <!-- barra -->
      <div class="flex items-center justify-between py-3">
        <!-- LOGO como RouterLink custom -->
        <RouterLink to="/" custom v-slot="{ navigate, href }">
          <a :href="href" @click="navigate" class="group">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-300 via-yellow-300 to-green-300 flex items-center justify-center shadow">
                🛠️
              </div>
              <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-black">
                Ferretería El Tornillo Feliz
              </span>
            </div>
          </a>
        </RouterLink>

        <!-- nav desktop -->
        <nav class="hidden lg:flex items-center gap-2">
          <RouterLink to="/" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.pink.base, isActive && variants.pink.active]">
              🏠 <span>Inicio</span>
            </a>
          </RouterLink>

          <RouterLink to="/products" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.yellow.base, isActive && variants.yellow.active]">
              🛠️ <span>Productos</span>
            </a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/products/admin" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.blue.base, isActive && variants.blue.active]">
              ⚙️ <span>Administrar</span>
            </a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/users" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.teal.base, isActive && variants.teal.active]">
              👤 <span>Usuarios</span>
            </a>
          </RouterLink>

          <!-- NUEVOS: enlaces admin -->
          <RouterLink v-if="auth.isAdmin" to="/admin/dashboard" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.blue.base, isActive && variants.blue.active]">
              📊 <span>Dashboard</span>
            </a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/purchases" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.green.base, isActive && variants.green.active]">
              🧾 <span>Compras</span>
            </a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/stock" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.yellow.base, isActive && variants.yellow.active]">
              📦 <span>Stock</span>
            </a>
          </RouterLink>
          <!-- /NUEVOS -->

          <RouterLink v-if="!auth.isLoggedIn" to="/auth/login" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate" :aria-current="isActive ? 'page' : undefined"
               :class="[baseLink, variants.green.base, isActive && variants.green.active]">
              🔑 <span>Login</span>
            </a>
          </RouterLink>

          <button type="button" v-else @click="auth.logout"
                  :class="[baseLink, variants.red.base]">
            🚪 <span>Logout</span>
          </button>

          <RouterLink to="/cart" custom v-slot="{ isActive, navigate, href }">
            <a :href="href" @click="navigate"
               :aria-current="isActive ? 'page' : undefined"
               :class="['relative ml-1', baseLink, 'px-5 py-2.5 rounded-2xl', variants.purple.base, isActive && variants.purple.active]">
              🛍️ <span>Carrito</span>
              <span v-if="count && count > 0"
                    class="absolute -top-2 -right-2 min-w-[1.75rem] h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-extrabold shadow">
                {{ count > 99 ? "99+" : count }}
              </span>
            </a>
          </RouterLink>
        </nav>

        <!-- botón hamburguesa (móvil) -->
        <button
          class="lg:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-300/60 bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          aria-label="Abrir menú"
          type="button"
          @click="open = !open"
        >
          <span class="sr-only">Abrir menú</span>
          <svg v-if="!open" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- nav móvil -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="open" id="mobile-menu" class="lg:hidden mt-2 mb-3 space-y-2">
          <RouterLink to="/" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.pink.base]">🏠 Inicio</a>
          </RouterLink>

          <RouterLink to="/products" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.yellow.base]">🛠️ Productos</a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/products/admin" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.blue.base]">⚙️ Administrar</a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/users" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.teal.base]">👤 Usuarios</a>
          </RouterLink>

          <!-- NUEVOS: enlaces admin (móvil) -->
          <RouterLink v-if="auth.isAdmin" to="/admin/dashboard" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.blue.base]">📊 Dashboard</a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/purchases" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.green.base]">🧾 Compras</a>
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin/stock" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.yellow.base]">📦 Stock</a>
          </RouterLink>
          <!-- /NUEVOS -->

          <RouterLink v-if="!auth.isLoggedIn" to="/auth/login" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['block w-full', baseLink, variants.green.base]">🔑 Login</a>
          </RouterLink>

          <button v-else type="button" @click="auth.logout(); open = false"
                  :class="['block w-full text-left', baseLink, variants.red.base]">🚪 Logout</button>

          <RouterLink to="/cart" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate(); open = false"
               :class="['flex items-center justify-between w-full', baseLink, variants.purple.base]">
              <span>🛍️ Carrito</span>
              <span v-if="count && count > 0"
                    class="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-extrabold">
                {{ count > 99 ? "99+" : count }}
              </span>
            </a>
          </RouterLink>
        </nav>
      </Transition>
    </div>
  </header>
</template>
