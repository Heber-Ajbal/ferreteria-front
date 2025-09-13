<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Botón flotante visible en todas las páginas (salvo meta.hideFab) -->
    <WhatsAppFab v-if="showFab" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import Header from "../src/components/Header.vue";
import WhatsAppFab from "../src/components/WhatsAppFab.vue";

const route = useRoute();
const showFab = computed(() => route.meta?.hideFab !== true);
</script>
