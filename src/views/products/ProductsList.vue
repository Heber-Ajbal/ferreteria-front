<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Nuestros Productos</h1>
      <p class="text-gray-600">Encuentra las mejores herramientas para tus proyectos</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          <span class="text-4xl opacity-50 group-hover:scale-110 transition-transform duration-300">
            {{ product.emoji }}
          </span>
        </div>
        
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-blue-600">Q{{ product.price }}</span>
            <button
              @click="addToCart(product)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>🛒</span>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart';

const cart = useCartStore();

const products = [
  { 
    id: 1, 
    name: "Martillo Profesional", 
    price: 150,
    description: "Martillo de carpintero con mango ergonómico",
    emoji: "🔨"
  },
  { 
    id: 2, 
    name: "Taladro Inalámbrico", 
    price: 800,
    description: "Taladro de 18V con batería de larga duración",
    emoji: "🔧"
  },
  { 
    id: 3, 
    name: "Set de Destornilladores", 
    price: 75,
    description: "Kit de destornilladores de precisión",
    emoji: "🪛"
  },
  { 
    id: 4, 
    name: "Llave Inglesa", 
    price: 120,
    description: "Llave ajustable de acero resistente",
    emoji: "🔧"
  },
];

function addToCart(product: any) {
  cart.add({
    id: product.id,
    name: product.name,
    price: product.price,
    qty: 1
  });
}
</script>