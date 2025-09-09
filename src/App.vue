<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="bg-gray-200 text-center py-4 text-sm">
      © 2025 Mi Ferretería
    </footer>
  </div>
</template>

<script setup>
import Header from "../src/components/Header.vue";
</script>
