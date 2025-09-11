<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "../../stores/cart";
import CartItem from "../../components/CartItem.vue";
import CheckoutModal from "../../components/CheckoutModal.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const cart = useCartStore();
const router = useRouter();
const { items, count, subtotal, tax, shipping, total } = storeToRefs(cart);

function setQty(id: number | string, qty: number) { cart.setQty(id, qty); }
function remove(id: number | string) { cart.remove(id); }

function money(n: number) {
  return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", maximumFractionDigits: 2 }).format(n);
}


// 🔹 Modal de checkout
const showCheckout = ref(false);

function openCheckout() { showCheckout.value = true; }
function onCheckoutClosed() { showCheckout.value = false; }

function onSubmitted(resp: any) {
  // resp podría tener { orderId }
  cart.clear();
  showCheckout.value = false;
  // Redirige a una página de "gracias" o muestra un toast
  // Aquí un redirect simple:
  router.push({ path: "/", query: { order: resp?.orderId ?? "ok" } });
}
</script>


<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tu Carrito</h1>
      <p class="text-gray-600">Revisa tus productos antes de finalizar la compra</p>
    </div>

    <!-- Carrito vacío -->
    <div v-if="!items.length" class="bg-white p-12 rounded-2xl text-center shadow-lg">
      <div class="text-6xl mb-4">🛒</div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
      <p class="text-gray-600 mb-6">Añade algunos productos para comenzar</p>
      <RouterLink to="/products"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Explorar productos
      </RouterLink>
    </div>

    <!-- Carrito con productos -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Lista de productos -->
      <div class="lg:col-span-2 space-y-4">
        <CartItem v-for="item in items" :key="item.id" :item="item" @qty="setQty" @remove="remove" />
      </div>

      <!-- Resumen de la orden -->
      <aside class="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Resumen</h2>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Artículos ({{ count }})</span>
            <span class="font-medium">{{ money(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Impuestos</span>
            <span class="font-medium">{{ money(tax) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Envío</span>
            <span class="font-medium">{{ shipping ? money(shipping) : "Gratis" }}</span>
          </div>
          <hr class="my-4" />
          <div class="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span class="text-blue-600">{{ money(total) }}</span>
          </div>
        </div>

        <button
          class="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          :disabled="!items.length" @click="openCheckout">
          Finalizar Compra
        </button>

        <!-- Modal -->
        <CheckoutModal :open="showCheckout" :items="items" :subtotal="subtotal" :tax="tax" :shipping="shipping || 0"
          :total="total" @close="onCheckoutClosed" @submitted="onSubmitted" />

      </aside>
    </div>
  </div>
</template>
