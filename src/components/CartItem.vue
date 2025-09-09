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
  <div class="flex gap-4 border rounded-xl p-4 bg-white">
    <img
      :src="item.image || placeholder"
      :alt="item.name"
      class="w-24 h-24 object-cover rounded-lg bg-gray-100"
    />

    <div class="flex-1">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="font-semibold text-gray-800">{{ item.name }}</h3>
          <p class="text-sm text-gray-500">ID: {{ item.id }}</p>
        </div>
        <button
          class="text-red-600 hover:underline text-sm"
          @click="$emit('remove', item.id)"
        >
          Quitar
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <!-- Qty controls -->
        <div class="inline-flex items-center rounded-lg border">
          <button class="px-3 py-1" @click="dec">−</button>
          <input
            class="w-12 text-center outline-none"
            type="number"
            min="1"
            :value="item.qty"
            @input="onInput"
          />
          <button class="px-3 py-1" @click="inc">＋</button>
        </div>

        <!-- Price -->
        <div class="text-right">
          <div class="text-sm text-gray-500">
            {{ money(item.price) }} × {{ item.qty }}
          </div>
          <div class="text-lg font-semibold">
            {{ money(item.price * item.qty) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

