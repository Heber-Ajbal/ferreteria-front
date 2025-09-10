<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import { storeToRefs } from "pinia";
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLogo } from "flowbite-vue";

const router = useRouter();
const cart = useCartStore();
const { count } = storeToRefs(cart);

const open = ref(false);

function go(path: string) {
  open.value = false;
  router.push(path);
}
</script>

<template>
  <header class="sticky top-0 z-50 overflow-hidden">
    <!-- Fondo con gradiente -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-pink-200/40 via-yellow-200/40 to-green-200/40 backdrop-blur-xl"
    ></div>
    <div class="absolute inset-0 bg-white/80"></div>

    <!-- Línea inferior -->
    <div
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400"
    ></div>

    <div class="relative mx-auto max-w-7xl px-4">
      <FwbNavbar
        class="!bg-transparent !px-0 !py-4 flex flex-wrap justify-between items-center"
      >
        <!-- LOGO -->
        <template #logo>
          <FwbNavbarLogo href="/" @click.prevent="go('/')" class="group">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-gradient-to-br from-pink-300 via-yellow-300 to-green-300 rounded-2xl flex items-center justify-center shadow-lg"
              >
                🛠️
              </div>
              <span
                class="text-2xl font-extrabold tracking-tight !text-black"
              >
                Ferretería El Tornillo Feliz
              </span>
            </div>
          </FwbNavbarLogo>
        </template>

        <template #default="{ isShowMenu }">
          <!-- Desktop -->
          <div class="hidden lg:flex items-center gap-3">
            <RouterLink
              to="/"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold !text-black bg-pink-300 hover:bg-pink-400 hover:!text-white transition-all duration-300"
              active-class="!bg-pink-500 !text-white"
              exact
            >
              🏠 <span>Inicio</span>
            </RouterLink>

            <RouterLink
              to="/products"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold !text-black bg-yellow-300 hover:bg-yellow-400 hover:!text-white transition-all duration-300"
              active-class="!bg-yellow-500 !text-white"
            >
              🛠️ <span>Productos</span>
            </RouterLink>

            <RouterLink
              to="/auth/login"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold !text-black bg-green-300 hover:bg-green-400 hover:!text-white transition-all duration-300"
              active-class="!bg-green-500 !text-white"
            >
              🔑 <span>Login</span>
            </RouterLink>

            <RouterLink
              to="/cart"
              class="group relative ml-3 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold !text-black bg-purple-300 hover:bg-purple-400 hover:!text-white transition-all duration-300"
              active-class="!bg-purple-500 !text-white"
            >
              🛍️ <span>Carrito</span>
              <span
                v-if="count && count > 0"
                class="absolute -top-2 -right-2 min-w-[1.75rem] h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-extrabold shadow-lg"
              >
                {{ count > 99 ? "99+" : count }}
              </span>
            </RouterLink>
          </div>

          <!-- Mobile -->
          <FwbNavbarCollapse
            :is-show-menu="open || isShowMenu"
            class="lg:hidden mt-4 flex flex-col gap-2"
          >
            <RouterLink
              to="/"
              class="block w-full px-4 py-3 rounded-lg font-bold !text-black bg-pink-300 hover:bg-pink-400 hover:!text-white transition-all duration-300"
              active-class="!bg-pink-500 !text-white"
              exact
            >
              🏠 Inicio
            </RouterLink>
            <RouterLink
              to="/products"
              class="block w-full px-4 py-3 rounded-lg font-bold !text-black bg-yellow-300 hover:bg-yellow-400 hover:!text-white transition-all duration-300"
              active-class="!bg-yellow-500 !text-white"
            >
              🛠️ Productos
            </RouterLink>
            <RouterLink
              to="/auth/login"
              class="block w-full px-4 py-3 rounded-lg font-bold !text-black bg-green-300 hover:bg-green-400 hover:!text-white transition-all duration-300"
              active-class="!bg-green-500 !text-white"
            >
              🔑 Login
            </RouterLink>
            <RouterLink
              to="/cart"
              class="block w-full px-4 py-3 rounded-lg font-bold !text-black bg-purple-300 hover:bg-purple-400 hover:!text-white transition-all duration-300"
              active-class="!bg-purple-500 !text-white"
            >
              🛍️ Carrito
              <span
                v-if="count && count > 0"
                class="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-extrabold"
              >
                {{ count > 99 ? "99+" : count }}
              </span>
            </RouterLink>
          </FwbNavbarCollapse>
        </template>
      </FwbNavbar>
    </div>
  </header>
</template>

<style scoped>
.animation-delay-0 {
  animation-delay: 0s;
}
.animation-delay-1000 {
  animation-delay: 1s;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
