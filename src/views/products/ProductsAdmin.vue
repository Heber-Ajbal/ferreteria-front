<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-100 rounded-xl">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-800">Administrar Productos</h1>
                <p class="text-gray-600 mt-1">Gestiona tu catálogo de productos</p>
              </div>
            </div>
            
            <RouterLink
              to="/products/new"
              class="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Agregar Producto
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Productos</p>
              <p class="text-2xl font-bold text-gray-800">{{ products.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Valor Total</p>
              <p class="text-2xl font-bold text-gray-800">Q{{ totalValue.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Precio Promedio</p>
              <p class="text-2xl font-bold text-gray-800">Q{{ averagePrice.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white rounded-2xl shadow-lg mb-8 p-6 border border-slate-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar productos..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
          <select
            v-model="sortBy"
            class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
          >
            <option value="id">Ordenar por ID</option>
            <option value="name">Ordenar por Nombre</option>
            <option value="price">Ordenar por Precio</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                    </svg>
                    ID
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    Producto
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                    Precio
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Descripción
                  </div>
                </th>
                <th class="py-4 px-6 text-center font-semibold">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                    Acciones
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-blue-50/50 transition-all duration-200 group"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-200">
                      {{ product.id }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-200">
                      <img 
                        v-if="product.image" 
                        :src="product.image" 
                        :alt="product.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <div 
                        v-else
                        class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl"
                      >
                        {{ product.name.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 text-lg">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ product.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-1">
                    <span class="text-lg font-bold text-green-600">Q{{ product.price.toFixed(2) }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="max-w-xs">
                    <p class="text-gray-600 truncate" :title="product.description">
                      {{ product.description }}
                    </p>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex justify-center gap-3">
                    <button
                      @click="editProduct(product.id)"
                      class="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Editar
                    </button>
                    <button
                      @click="deleteProduct(product.id)"
                      class="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">No se encontraron productos</h3>
                <p class="text-gray-600">{{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto' }}</p>
              </div>
              <RouterLink
                v-if="!searchQuery"
                to="/products/new"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Agregar Primer Producto
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estados reactivos para búsqueda y filtros
const searchQuery = ref("");
const sortBy = ref("id");

// Datos de ejemplo con imágenes reales de Unsplash
const products = ref([
  { 
    id: 1, 
    name: "Martillo", 
    price: 150, 
    description: "Martillo de carpintero de alta calidad con mango ergonómico",
    image: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=400&h=400&fit=crop&crop=center"
  },
  { 
    id: 2, 
    name: "Taladro", 
    price: 800, 
    description: "Taladro inalámbrico 18V con batería de larga duración",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop&crop=center"
  },
  { 
    id: 3, 
    name: "Destornilladores", 
    price: 75, 
    description: "Kit completo de destornilladores con diferentes puntas",
    image: "https://images.unsplash.com/photo-1609205805971-de2ad4b6fc33?w=400&h=400&fit=crop&crop=center"
  },
]);

// Computed properties para estadísticas
const totalValue = computed(() => {
  return products.value.reduce((sum, product) => sum + product.price, 0);
});

const averagePrice = computed(() => {
  return products.value.length > 0 ? totalValue.value / products.value.length : 0;
});

// Computed para productos filtrados y ordenados
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  // Ordenar
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'id':
      default:
        return a.id - b.id;
    }
  });

  return filtered;
});

function editProduct(id: number) {
  router.push(`/products/edit/${id}`);
}

function deleteProduct(id: number) {
  const product = products.value.find(p => p.id === id);
  if (confirm(`¿Seguro que quieres eliminar "${product?.name}"?`)) {
    products.value = products.value.filter(p => p.id !== id);
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  const container = img.parentElement;
  if (container) {
    img.style.display = 'none';
    // Mostrar el fallback con inicial
    const fallback = container.querySelector('div');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
}
</script>