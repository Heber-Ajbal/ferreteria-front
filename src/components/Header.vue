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
  <header
    class="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/60 backdrop-blur border-b border-gray-100/70 dark:border-gray-800"
  >
    <div class="mx-auto max-w-7xl px-4">
      <FwbNavbar class="!bg-transparent !px-0">
        <!-- LOGO -->
        <template #logo>
          <FwbNavbarLogo href="/" @click.prevent="go('/')">
            <span
              class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              🛒 Mi Ferretería
            </span>
          </FwbNavbarLogo>
        </template>

        <!-- TODO el contenido va en UN solo #default -->
        <template #default="{ isShowMenu }">
          <!-- DESKTOP -->
          <div class="hidden lg:flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
            <RouterLink
              to="/"
              class="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              active-class="text-blue-600 dark:text-blue-400"
              exact
            >Inicio</RouterLink>

            <RouterLink
              to="/products"
              class="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              active-class="text-blue-600 dark:text-blue-400"
            >Productos</RouterLink>

            <RouterLink
              to="/auth/login"
              class="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              active-class="text-blue-600 dark:text-blue-400"
            >Login</RouterLink>

            <RouterLink
              to="/cart"
              class="relative inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
              active-class="ring-2 ring-blue-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 10 19h9v-2h-8.42a.25.25 0 0 1-.22-.37L11 14h6a2 2 0 0 0 1.79-1.11l3.58-6.49A1 1 0 0 0 21.5 5H7.42l-.7-1.4A1 1 0 0 0 6 3H2v2h3l3 6-1.1 2A3 3 0 0 0 10 17h9a3 3 0 1 0 0 6 3 3 0 0 0 0-6H10a1 1 0 0 1-.89-1.45L10 13h7a4 4 0 0 0 3.58-2.23l3.58-6.49A3 3 0 0 0 21.5 3H7Z"/>
              </svg>
              <span>Carrito</span>
              <span
                v-if="count"
                class="absolute -top-1 -right-2 min-w-[1.25rem] text-center rounded-full bg-blue-600 text-white text-[10px] px-1.5 py-0.5"
              >{{ count }}</span>
            </RouterLink>
          </div>

          <!-- TOGGLE móvil -->
          <button
            class="lg:hidden inline-flex items-center justify-center rounded-md p-2
                   hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-expanded="open ? 'true' : 'false'"
            @click="open = !open"
          >
            <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- MÓVIL -->
          <FwbNavbarCollapse
            :is-show-menu="open || isShowMenu"
            class="lg:hidden mt-2 space-y-1 text-gray-800 dark:text-gray-100"
          >
            <button class="block w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.prevent="go('/')">Inicio</button>
            <button class="block w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.prevent="go('/products')">Productos</button>
            <button class="block w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.prevent="go('/auth/login')">Login</button>
            <button class="relative block w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.prevent="go('/cart')">
              Carrito
              <span v-if="count"
                    class="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] text-white">
                {{ count }}
              </span>
            </button>
          </FwbNavbarCollapse>
        </template>
      </FwbNavbar>
    </div>
  </header>
</template>

