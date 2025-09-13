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
  <div class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 p-6">
    
    <!-- Imagen y badge -->
    <div class="flex gap-6">
      <div class="relative flex-shrink-0">
        <div class="w-32 h-32 rounded-2xl overflow-hidden shadow-md">
          <img :src="item.image_url || placeholder" :alt="item.name" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          En Stock
        </div>
      </div>

      <!-- Contenido -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-bold text-xl text-gray-900 mb-1">{{ item.name }}</h3>
            <span class="text-gray-500 text-sm">ID: {{ item.id }}</span>
          </div>

          <!-- Botón Quitar -->
          <button
            class="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-lg font-bold"
            @click="$emit('remove', item.id)"
          >
            ❌
          </button>
        </div>

        <!-- Controles de cantidad y precio -->
        <div class="flex items-center justify-between">
          <!-- Cantidad -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Cantidad:</span>
            <button class="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg" @click="dec">➖</button>
            <input type="number" min="1" :value="item.qty" @input="onInput" class="w-16 text-center border rounded"/>
            <button class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg" @click="inc">➕</button>
          </div>

          <!-- Precio -->
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-1">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ money(item.price) }}</span>
              ×
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded">{{ item.qty }}</span>
            </div>
            <div class="text-2xl font-bold text-gray-900">
              {{ money(item.price * item.qty) }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
