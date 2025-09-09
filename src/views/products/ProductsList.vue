<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Nuestros productos</h2>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="p in products"
        :key="p.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
      >
        <div class="h-40 bg-gray-100 flex items-center justify-center mb-4 rounded">
          <span class="text-gray-400">Imagen</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">{{ p.name }}</h3>
        <p class="text-blue-600 font-bold mt-2">${{ p.price }}</p>
        <button
          class="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = [
  { id: 1, name: "Martillo", price: 150 },
  { id: 2, name: "Taladro", price: 800 },
  { id: 3, name: "Destornillador", price: 75 },
  { id: 4, name: "Llave inglesa", price: 120 },
];
</script>
