<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "../../stores/cart";
import CartItem from "../../components/CartItem.vue";

const cart = useCartStore();
const { items, count, subtotal, tax, shipping, total } = storeToRefs(cart);

function setQty(id: number | string, qty: number) {
  cart.setQty(id, qty);
}
function remove(id: number | string) {
  cart.remove(id);
}


function money(n: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }).format(n);
}

// Mock: si quieres probar rápido, descomenta:
/*
cart.add({ id: "martillo-1", name: "Martillo", price: 150, qty: 1 });
cart.add({ id: "taladro-2", name: "Taladro", price: 800, qty: 2, image: "https://via.placeholder.com/200" });
*/
async function checkout() {
  // Aquí luego haremos POST /orders con los items del carrito
  alert("UI lista. Después conectamos con el backend NestJS. ✅");
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Tu carrito</h1>

    <!-- vacío -->
    <div v-if="!items.length" class="bg-white p-10 rounded-2xl text-center shadow">
      <p class="text-gray-600">Aún no tienes productos en el carrito.</p>
      <RouterLink
        to="/products"
        class="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Ir a productos
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- lista -->
      <div class="lg:col-span-2 space-y-4">
        <CartItem
          v-for="it in items"
          :key="it.id"
          :item="it"
          @qty="setQty"
          @remove="remove"
        />
      </div>

      <!-- resumen -->
      <aside class="bg-white rounded-2xl shadow p-5 h-fit sticky top-6">
        <h2 class="text-lg font-semibold mb-4">Resumen de la orden</h2>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Artículos ({{ count }})</span>
            <span>{{ money(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Impuestos</span>
            <span>{{ money(tax) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Envío</span>
            <span>{{ shipping ? money(shipping) : "Gratis" }}</span>
          </div>
          <hr class="my-2" />
          <div class="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{{ money(total) }}</span>
          </div>
        </div>

        <button
          class="w-full mt-5 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
          :disabled="!items.length"
          @click="checkout"
        >
          Finalizar compra
        </button>

        <!-- Campo de cupón (solo UI por ahora) -->
        <div class="mt-4">
          <label class="block text-sm text-gray-600 mb-1">Cupón</label>
          <div class="flex gap-2">
            <input
              v-model="coupon"
              placeholder="PROMO10"
              class="flex-1 border rounded-lg px-3 py-2"
            />
            <button class="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Aplicar
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

