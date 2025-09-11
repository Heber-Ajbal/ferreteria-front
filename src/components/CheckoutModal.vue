<!-- src/components/CheckoutModal.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { CheckoutPayload } from "../services/sales";
import { placeOrder } from "../services/sales";

type CartItem = { id: number | string; name: string; price?: number | null; qty: number };

const props = defineProps<{
  open: boolean;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping?: number; // puede venir undefined => 0
  total: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submitted", data: any): void;
}>();

const visible = ref(false);
watch(() => props.open, (v) => (visible.value = v), { immediate: true });

// Form
const name = ref("");
const phone = ref("");
const email = ref("");
const nit = ref("");
const address = ref("");
const deliveryMethod = ref<"pickup" | "delivery">("pickup");
const paymentMethod = ref<"cash" | "card" | "transfer">("cash");
const reference = ref("");

const loading = ref(false);
const err = ref("");

const shippingCost = computed(() => Number(props.shipping ?? 0));
const disabled = computed(() => {
  if (!props.items.length) return true;
  if (!name.value.trim() || !phone.value.trim()) return true;
  if (deliveryMethod.value === "delivery" && !address.value.trim()) return true;
  if (paymentMethod.value === "transfer" && !reference.value.trim()) return true;
  return false;
});

function reset() {
  err.value = "";
  name.value = "";
  phone.value = "";
  email.value = "";
  nit.value = "";
  address.value = "";
  deliveryMethod.value = "pickup";
  paymentMethod.value = "cash";
  reference.value = "";
}

function close() {
  visible.value = false;
  // give a tiny delay so transition feels nice before emitting close
  setTimeout(() => emit("close"), 150);
}

async function submit() {
  if (disabled.value) return;

  loading.value = true;
  err.value = "";

  try {
    const payload: CheckoutPayload = {
      items: props.items.map((i) => ({
        productId: i.id,
        quantity: i.qty,
        unitPrice: Number(i.price ?? 0),
      })),
      summary: {
        subtotal: Number(props.subtotal || 0),
        tax: Number(props.tax || 0),
        shipping: Number(props.shipping || 0),
        total: Number(props.total || 0),
      },
      customer: {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim() || undefined,
        nit: nit.value.trim() || undefined,
        address: deliveryMethod.value === "delivery" ? address.value.trim() : undefined,
      },
      delivery: {
        method: deliveryMethod.value,
      },
      payment: {
        method: paymentMethod.value,
        reference: paymentMethod.value === "transfer" ? reference.value.trim() : undefined,
      },
    };

    const resp = await placeOrder(payload);
    emit("submitted", resp);
    reset();
    close();
  } catch (e: any) {
    err.value = e?.response?.data?.message || "No se pudo procesar la compra";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100]">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <!-- Modal -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-xl border">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Finalizar compra</h3>
            <button class="rounded p-1 hover:bg-gray-100" @click="close">✕</button>
          </div>

          <!-- Body -->
          <div class="p-5 grid gap-6 md:grid-cols-2">
            <!-- Cliente -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Datos del cliente</h4>
              <div class="space-y-3">
                <input v-model="name" type="text" placeholder="Nombre completo" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                <input v-model="phone" type="tel" placeholder="Teléfono" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                <input v-model="email" type="email" placeholder="Email (opcional)" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                <input v-model="nit" type="text" placeholder="NIT (opcional)" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="mt-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Entrega</label>
                <div class="flex gap-2">
                  <button
                    :class="['flex-1 rounded-lg border px-3 py-2', deliveryMethod === 'pickup' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300']"
                    @click="deliveryMethod = 'pickup'"
                  >
                    Retiro en tienda
                  </button>
                  <button
                    :class="['flex-1 rounded-lg border px-3 py-2', deliveryMethod === 'delivery' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300']"
                    @click="deliveryMethod = 'delivery'"
                  >
                    Envío a domicilio
                  </button>
                </div>

                <textarea
                  v-if="deliveryMethod === 'delivery'"
                  v-model="address"
                  rows="3"
                  placeholder="Dirección de entrega"
                  class="mt-3 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="mt-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pago</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    :class="['rounded-lg border px-3 py-2 text-sm', paymentMethod === 'cash' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300']"
                    @click="paymentMethod = 'cash'"
                  >Efectivo</button>
                  <button
                    :class="['rounded-lg border px-3 py-2 text-sm', paymentMethod === 'card' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300']"
                    @click="paymentMethod = 'card'"
                  >Tarjeta</button>
                  <button
                    :class="['rounded-lg border px-3 py-2 text-sm', paymentMethod === 'transfer' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300']"
                    @click="paymentMethod = 'transfer'"
                  >Transferencia</button>
                </div>

                <input
                  v-if="paymentMethod === 'transfer'"
                  v-model="reference"
                  type="text"
                  placeholder="Referencia de transferencia"
                  class="mt-3 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Resumen -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Resumen de la orden</h4>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between"><span class="text-gray-600">Artículos ({{ props.items.length }})</span><span class="font-medium">{{ new Intl.NumberFormat('es-GT',{style:'currency',currency:'GTQ'}).format(props.subtotal) }}</span></div>
                <div class="flex justify-between"><span class="text-gray-600">Impuestos</span><span class="font-medium">{{ new Intl.NumberFormat('es-GT',{style:'currency',currency:'GTQ'}).format(props.tax) }}</span></div>
                <div class="flex justify-between"><span class="text-gray-600">Envío</span><span class="font-medium">{{ shippingCost ? new Intl.NumberFormat('es-GT',{style:'currency',currency:'GTQ'}).format(shippingCost) : 'Gratis' }}</span></div>
                <hr class="my-3" />
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span class="text-blue-600">{{ new Intl.NumberFormat('es-GT',{style:'currency',currency:'GTQ'}).format(props.total) }}</span>
                </div>
              </div>

              <div v-if="err" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {{ err }}
              </div>

              <button
                class="mt-6 w-full rounded-lg bg-green-600 py-3 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                :disabled="disabled || loading"
                @click="submit"
              >
                <span v-if="!loading">Confirmar pedido</span>
                <span v-else class="inline-flex items-center gap-2">
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
                  </svg>
                  Procesando…
                </span>
              </button>

              <p class="mt-3 text-xs text-gray-500">
                Al confirmar aceptas nuestros términos y política de privacidad.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-5 border-t flex justify-end">
            <button class="px-4 py-2 rounded-lg border hover:bg-gray-50" @click="close">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
