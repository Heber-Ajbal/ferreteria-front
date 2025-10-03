<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getStock } from '../../services/purchases';

const rows = ref<{productId:number; name:string; stock:number}[]>([]);
const q = ref('');
onMounted(async ()=>{ rows.value = await getStock(); });
const filtered = computed(()=> rows.value.filter(r => r.name.toLowerCase().includes(q.value.toLowerCase()) || String(r.productId).includes(q.value)));

const getStockColor = (stock: number) => {
  if (stock === 0) return 'text-red-600 bg-red-50';
  if (stock < 10) return 'text-orange-600 bg-orange-50';
  if (stock < 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'Sin stock';
  if (stock < 10) return 'Stock bajo';
  if (stock < 50) return 'Stock medio';
  return 'Stock alto';
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventario de Stock
          </h1>
          <p class="text-gray-600 mt-2">{{ filtered.length }} productos encontrados</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div class="text-sm text-gray-600">Total productos</div>
          <div class="text-3xl font-bold text-blue-600">{{ rows.length }}</div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input 
          class="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg shadow-sm"
          placeholder="Buscar por nombre o ID del producto..." 
          v-model="q"
        />
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Producto</th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">Cantidad</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="r in filtered" 
                :key="r.productId" 
                class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                <td class="px-6 py-4">
                  <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm shadow-md">
                    {{ r.productId }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900 text-lg">{{ r.name }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span 
                    :class="getStockColor(r.stock)"
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  >
                    <span class="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                    {{ getStockStatus(r.stock) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {{ r.stock }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="filtered.length === 0" class="py-16 text-center">
            <svg class="mx-auto w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p class="text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>