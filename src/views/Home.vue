<!-- src/views/Home.vue -->
<template>
  <section class="text-center py-16">
    <h1 class="text-4xl font-extrabold text-gray-800 mb-4">
      Bienvenido a <span class="text-blue-600">Mi Ferretería</span>
    </h1>
    <p class="text-gray-600 mb-6">
      Encuentra las mejores herramientas y productos al mejor precio.
    </p>
    <RouterLink
      to="/products"
      class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
    >
      Ver productos
    </RouterLink>
  </section>
</template>
