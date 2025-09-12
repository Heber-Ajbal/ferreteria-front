<!-- src/components/CheckoutModal.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";              // ⭐ NUEVO
import Swal from "sweetalert2";                                // ⭐ NUEVO
import "sweetalert2/dist/sweetalert2.min.css";                 // ⭐ NUEVO
import type { CheckoutPayload } from "../services/sales";
import { placeOrder } from "../services/sales";
import { useAuthStore } from "../stores/auth";                 // ⭐ NUEVO

type CartItem = { id: number | string; name: string; price?: number | null; qty: number };

const props = defineProps<{
  open: boolean;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping?: number;
  total: number;
}>();

const emit = defineEmits<{ (e: "close"): void; (e: "submitted", data: any): void }>();

const auth = useAuthStore();                                   // ⭐ NUEVO
const router = useRouter();                                    // ⭐ NUEVO
const route = useRoute();                                      // ⭐ NUEVO

const visible = ref(false);
const name = ref(""), phone = ref(""), email = ref(""), nit = ref(""), address = ref(""),
  deliveryMethod = ref<"pickup" | "delivery">("pickup"),
  paymentMethod = ref<"cash" | "card" | "transfer">("cash"),
  reference = ref("");

const loading = ref(false);
const err = ref("");

const fmt = (n: number) => new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(Number(n || 0));
const shippingCost = computed(() => Number(props.shipping ?? 0));
const disabled = computed(() => {
  if (!props.items.length) return true;
  if (!name.value.trim() || !phone.value.trim()) return true;
  if (deliveryMethod.value === "delivery" && !address.value.trim()) return true;
  if (paymentMethod.value === "transfer" && !reference.value.trim()) return true;
  return false;
});

// ⭐ NUEVO: popup para exigir login
async function ensureLoggedIn(): Promise<boolean> {
  if (auth?.isLoggedIn) return true;

  const res = await Swal.fire({
    title: "Inicia sesión para continuar",
    text: "Debes iniciar sesión para completar tu compra.",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Iniciar sesión",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl",
      confirmButton:
        "rounded-lg bg-slate-900 text-white px-4 py-2 font-medium hover:bg-black focus:ring-2 focus:ring-slate-300",
      cancelButton:
        "ml-2 rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50",
    },
  });

  if (res.isConfirmed) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`);
  }
  return false;
}

watch(
  () => props.open,
  async (v) => {
    visible.value = v;
    if (v) {
      const ok = await ensureLoggedIn();                        // ⭐ NUEVO
      if (!ok) {
        visible.value = false;
        emit("close");
      }
    }
  },
  { immediate: true }
);

function reset() {
  err.value = "";
  name.value = phone.value = email.value = nit.value = address.value = reference.value = "";
  deliveryMethod.value = "pickup";
  paymentMethod.value = "cash";
}

function close() {
  visible.value = false;
  setTimeout(() => emit("close"), 150);
}

async function submit() {
  // ⭐ NUEVO: doble validación por si el modal ya estaba abierto
  if (!(await ensureLoggedIn())) return;

  if (disabled.value) return;
  loading.value = true; err.value = "";
  try {
    const payload: CheckoutPayload = {
      items: props.items.map(i => ({ productId: i.id, quantity: i.qty, unitPrice: Number(i.price ?? 0) })),
      summary: { subtotal: Number(props.subtotal || 0), tax: Number(props.tax || 0), shipping: Number(props.shipping || 0), total: Number(props.total || 0) },
      customer: {
        name: name.value.trim(), phone: phone.value.trim(),
        email: email.value.trim() || undefined, nit: nit.value.trim() || undefined,
        address: deliveryMethod.value === "delivery" ? address.value.trim() : undefined,
      },
      delivery: { method: deliveryMethod.value },
      payment: { method: paymentMethod.value, reference: paymentMethod.value === "transfer" ? reference.value.trim() : undefined },
    };
    const resp = await placeOrder(payload);
    emit("submitted", resp); reset(); close();
  } catch (e: any) {
    err.value = e?.response?.data?.message || "No se pudo procesar la compra";
  } finally { loading.value = false; }
}
</script>

<!-- Tu <template> y <style> quedan igual que el último que pegaste -->

<template>
  <transition name="fade-zoom">
    <div v-if="visible" class="fixed inset-0 z-[100]">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="close" />

      <!-- Wrapper (bottom-sheet en móvil) -->
      <div class="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6">
        <div class="w-full sm:max-w-3xl md:max-w-4xl">
          <!-- Marco con borde suave -->
          <div
            class="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-300/40 via-sky-300/40 to-emerald-300/40 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
            <div role="dialog" aria-modal="true" aria-labelledby="checkout-title"
              class="rounded-2xl bg-white text-slate-900 ring-1 ring-white/40">
              <!-- Header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
                <div class="flex items-center gap-3">
                  <span
                    class="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white grid place-items-center shadow">
                    <!-- cart icon -->
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"
                      shape-rendering="geometricPrecision" aria-hidden="true">
                      <circle cx="9" cy="20" r="1.5"></circle>
                      <circle cx="17" cy="20" r="1.5"></circle>
                      <path d="M3 4h2l2.5 12h10l2-8H6.5"></path>
                    </svg>
                  </span>
                  <h3 id="checkout-title" class="text-lg font-semibold">Finalizar compra</h3>
                </div>
                <button class="p-2 rounded-lg hover:bg-slate-100 transition" @click="close" aria-label="Cerrar">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 6l12 12M6 18L18 6"></path>
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="p-5 grid gap-6 md:grid-cols-5">
                <!-- Izquierda -->
                <div class="md:col-span-3 space-y-6">
                  <!-- Datos del cliente (SIN iconos en inputs) -->
                  <section>
                    <h4 class="font-medium text-slate-900 mb-3">Datos del cliente</h4>
                    <div class="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label for="c-name" class="block text-sm font-medium text-slate-700 mb-1">Nombre
                          completo</label>
                        <input id="c-name" v-model="name" type="text" placeholder="Nombre completo"
                          class="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                      </div>
                      <div>
                        <label for="c-phone" class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                        <input id="c-phone" v-model="phone" type="tel" placeholder="Teléfono"
                          class="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                      </div>
                      <div class="sm:col-span-2">
                        <label for="c-email" class="block text-sm font-medium text-slate-700 mb-1">Email
                          (opcional)</label>
                        <input id="c-email" v-model="email" type="email" placeholder="mail@ejemplo.com"
                          class="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                      </div>
                      <div class="sm:col-span-2">
                        <label for="c-nit" class="block text-sm font-medium text-slate-700 mb-1">NIT (opcional)</label>
                        <input id="c-nit" v-model="nit" type="text" placeholder="NIT"
                          class="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                      </div>
                    </div>
                  </section>

                  <!-- Entrega (con iconos) -->
                  <section>
                    <h4 class="font-medium text-slate-900 mb-3">Entrega</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <button type="button" @click="deliveryMethod = 'pickup'"
                        :class="['group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                          deliveryMethod === 'pickup' ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-300 hover:bg-slate-50']">
                        <span class="h-9 w-9 rounded-lg grid place-items-center"
                          :class="deliveryMethod === 'pickup' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'">
                          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 20V8l9-5 9 5v12"></path>
                            <path d="M9 22V12h6v10"></path>
                          </svg>
                        </span>
                        <div class="text-sm">
                          <p class="font-medium">Retiro en tienda</p>
                          <p class="text-slate-500">Gratis y rápido</p>
                        </div>
                      </button>

                      <button type="button" @click="deliveryMethod = 'delivery'"
                        :class="['group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                          deliveryMethod === 'delivery' ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-300 hover:bg-slate-50']">
                        <span class="h-9 w-9 rounded-lg grid place-items-center"
                          :class="deliveryMethod === 'delivery' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'">
                          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 16V6h11v10"></path>
                            <path d="M14 8h4l3 3v5h-7z"></path>
                            <circle cx="7.5" cy="17.5" r="1.5"></circle>
                            <circle cx="17.5" cy="17.5" r="1.5"></circle>
                          </svg>
                        </span>
                        <div class="text-sm">
                          <p class="font-medium">Envío a domicilio</p>
                          <p class="text-slate-500">Costo según zona</p>
                        </div>
                      </button>
                    </div>

                    <textarea v-if="deliveryMethod === 'delivery'" v-model="address" rows="3"
                      placeholder="Dirección de entrega"
                      class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                  </section>

                  <!-- Pago (con iconos) -->
                  <section>
                    <h4 class="font-medium text-slate-900 mb-3">Pago</h4>
                    <div class="grid grid-cols-3 gap-3">
                      <button type="button" @click="paymentMethod = 'cash'"
                        :class="['flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition',
                          paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100' : 'border-slate-300 hover:bg-slate-50']">
                        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                        Efectivo
                      </button>
                      <button type="button" @click="paymentMethod = 'card'"
                        :class="['flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition',
                          paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-300 hover:bg-slate-50']">
                        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                        Tarjeta
                      </button>
                      <button type="button" @click="paymentMethod = 'transfer'"
                        :class="['flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition',
                          paymentMethod === 'transfer' ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-100' : 'border-slate-300 hover:bg-slate-50']">
                        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M3 10h18M7 14h6M7 18h6" />
                        </svg>
                        Transferencia
                      </button>
                    </div>

                    <input v-if="paymentMethod === 'transfer'" v-model="reference" type="text"
                      placeholder="Referencia de transferencia"
                      class="mt-3 w-full h-11 rounded-xl border border-slate-300 bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400" />
                  </section>
                </div>

                <!-- Resumen -->
                <aside class="md:col-span-2">
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 shadow-sm">
                    <h4 class="font-medium text-slate-900 mb-3">Resumen de la orden</h4>

                    <div class="max-h-44 overflow-auto rounded-lg border border-slate-200/70 bg-white divide-y">
                      <div v-for="i in props.items" :key="i.id"
                        class="flex items-center justify-between px-3 py-2 text-sm">
                        <div class="min-w-0">
                          <p class="truncate text-slate-800 font-medium">{{ i.name }}</p>
                          <p class="text-slate-500">x{{ i.qty }}</p>
                        </div>
                        <div class="text-right font-medium">{{ fmt((i.price ?? 0) * i.qty) }}</div>
                      </div>
                      <div v-if="!props.items.length" class="px-3 py-6 text-center text-slate-500 text-sm">Tu carrito
                        está vacío</div>
                    </div>

                    <div class="mt-4 space-y-2 text-sm">
                      <div class="flex justify-between"><span class="text-slate-600">Subtotal</span><span
                          class="font-medium">{{ fmt(props.subtotal) }}</span></div>
                      <div class="flex justify-between"><span class="text-slate-600">Impuestos</span><span
                          class="font-medium">{{ fmt(props.tax) }}</span></div>
                      <div class="flex justify-between"><span class="text-slate-600">Envío</span><span
                          class="font-medium">{{ shippingCost ? fmt(shippingCost) : 'Gratis' }}</span></div>
                      <div class="h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent my-2"></div>
                      <div class="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span class="text-indigo-700">{{ fmt(props.total) }}</span>
                      </div>
                    </div>

                    <div v-if="err" class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {{ err }}
                    </div>

                    <!-- Botones -->
                    <div class="mt-4 flex flex-col sm:flex-row gap-2">
                      <button type="button"
                        class="h-11 w-full sm:flex-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition"
                        @click="close">
                        <!-- icono ← -->
                        <span class="inline-flex items-center justify-center gap-2">
                          Cancelar
                        </span>
                      </button>

                      <button type="button" :disabled="disabled || loading"
                        class="h-11 w-full sm:flex-1 min-w-[12rem] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:from-indigo-700 hover:to-blue-700 active:scale-[.99] transition disabled:cursor-not-allowed disabled:brightness-95 disabled:saturate-75 whitespace-nowrap px-4"
                        @click="submit">
                        <span v-if="!loading" class="inline-flex items-center gap-2 text-white">
                          Confirmar pedido
                        </span>
                        <span v-else class="inline-flex items-center gap-2 text-white">
                          <span
                            class="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          Procesando…
                        </span>
                      </button>

                    </div>

                    <p class="mt-3 text-[11px] text-slate-500">Al confirmar aceptas nuestros términos y política de
                      privacidad.</p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(.98);
}
</style>
