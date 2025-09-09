<script setup lang="ts">
import type { CartItem as ICartItem } from "../stores/cart";

const props = defineProps<{ item: ICartItem }>();
const emit = defineEmits<{
  (e: "qty", id: ICartItem["id"], qty: number): void;
  (e: "remove", id: ICartItem["id"]): void;
}>();

const placeholder =
  "https://via.placeholder.com/200x200.png?text=Producto";

function money(n: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }).format(n);
}

function inc() {
  emit("qty", props.item.id, props.item.qty + 1);
}
function dec() {
  emit("qty", props.item.id, Math.max(1, props.item.qty - 1));
}
function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value || "1");
  emit("qty", props.item.id, Math.max(1, v));
}
</script>

<template>
  <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50">
    <!-- Decorative gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Animated border glow -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 -z-10"></div>
    
    <div class="relative p-6 flex gap-6">
      <!-- Enhanced Image Container -->
      <div class="relative flex-shrink-0">
        <div class="w-32 h-32 rounded-2xl overflow-hidden shadow-md ring-4 ring-white/50 group-hover:ring-blue-200/70 transition-all duration-300">
          <img
            :src="item.image || placeholder"
            :alt="item.name"
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <!-- Floating badge -->
        <div class="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          En Stock
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 min-w-0">
        <!-- Header with improved typography -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1">
            <h3 class="font-bold text-xl text-gray-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors duration-200">
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ID: {{ item.id }}
              </span>
            </div>
          </div>
          
          <!-- Enhanced Remove Button -->
          <button
            class="group/btn relative flex items-center justify-center w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
            @click="$emit('remove', item.id)"
            title="Quitar producto"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Quitar
            </span>
          </button>
        </div>

        <!-- Enhanced Controls Section -->
        <div class="flex items-center justify-between">
          <!-- Stylish Quantity Controls -->
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-600 mr-3">Cantidad:</span>
            <div class="inline-flex items-center bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:border-blue-300 transition-colors duration-200 overflow-hidden">
              <button 
                class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                @click="dec"
                :disabled="item.qty <= 1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path>
                </svg>
              </button>
              
              <input
                class="w-16 h-10 text-center text-lg font-semibold text-gray-800 bg-gray-50 focus:bg-white border-none outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                type="number"
                min="1"
                :value="item.qty"
                @input="onInput"
              />
              
              <button 
                class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                @click="inc"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Enhanced Price Display -->
          <div class="text-right">
            <div class="flex items-center justify-end gap-2 text-sm text-gray-500 mb-1">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
                {{ money(item.price) }}
              </span>
              <span>×</span>
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">
                {{ item.qty }}
              </span>
            </div>
            <div class="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {{ money(item.price * item.qty) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative bottom accent -->
    <div class="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60"></div>
  </div>
</template>