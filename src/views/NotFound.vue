<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="text-6xl mb-4">🛠️</div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
      <p class="text-gray-600 mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <RouterLink 
        to="/"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver al inicio
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// Componente 404 simple
</script>