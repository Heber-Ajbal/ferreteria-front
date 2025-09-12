<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getProducts,
  deleteProduct as apiDeleteProduct,
  type Product
} from "../../services/products";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const products = ref<Product[]>([]);
const total = ref(0);

// server pagination (simple)
const page = ref(1);
const pageSize = ref(12);

// search / sort
const search = ref("");
const sortBy = ref<"id" | "name" | "price">("id");

// delete modal
const toDelete = ref<Product | null>(null);
const deleting = ref(false);

// fetch
async function fetchProducts() {
  loading.value = true;
  error.value = "";
  try {
    const { data, meta } = await getProducts({
      search: search.value || undefined,
      page: page.value,
      pageSize: pageSize.value
    });
    products.value = data;
    total.value = Number(meta?.total ?? 0);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "No se pudo cargar productos";
  } finally {
    loading.value = false;
  }
}

let timer: number | undefined;
function debouncedFetch() {
  clearTimeout(timer);
  // @ts-ignore
  timer = setTimeout(() => { page.value = 1; fetchProducts(); }, 350);
}

onMounted(fetchProducts);

// stats
const totalValue = computed(() =>
  products.value.reduce((acc, p) => acc + Number(p.sale_price || 0), 0)
);
const averagePrice = computed(() =>
  products.value.length ? totalValue.value / products.value.length : 0
);

// client-side sort on current page
const sortedProducts = computed(() => {
  const arr = [...products.value];
  switch (sortBy.value) {
    case "name": return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    case "price": return arr.sort((a, b) => Number(a.sale_price || 0) - Number(b.sale_price || 0));
    case "id":
    default: return arr.sort((a, b) => Number(a.product_id || 0) - Number(b.product_id || 0));
  }
});

function money(n: any) {
  return Number(n ?? 0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).style.display = "none";
}

function editProduct(id: number) {
  router.push(`/products/edit/${id}`);
}

function confirmDelete(p: Product) {
  toDelete.value = p;
}

async function doDelete() {
  if (!toDelete.value) return;
  deleting.value = true;
  try {
    await apiDeleteProduct(toDelete.value.product_id);
    toDelete.value = null;
    await fetchProducts();
  } catch (e: any) {
    alert(e?.response?.data?.message || "No se pudo eliminar el producto");
  } finally {
    deleting.value = false;
  }
}

function prev() { if (page.value > 1) { page.value--; fetchProducts(); } }
function next() { if (page.value * pageSize.value < total.value) { page.value++; fetchProducts(); } }
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-100 rounded-xl">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-800">Administrar Productos</h1>
                <p class="text-gray-600 mt-1">Gestiona tu catálogo de productos</p>
              </div>
            </div>

            <RouterLink to="/products/new"
              class="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 !text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Producto
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Productos (página)</p>
              <p class="text-2xl font-bold text-gray-800">{{ products.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Valor Total (página)</p>
              <p class="text-2xl font-bold text-gray-800">Q{{ totalValue.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Precio Promedio (página)</p>
              <p class="text-2xl font-bold text-gray-800">Q{{ averagePrice.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search / Sort -->
      <div class="bg-white rounded-2xl shadow-lg mb-8 p-6 border border-slate-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input v-model="search" @input="debouncedFetch" type="text"
                placeholder="Buscar por nombre, SKU o código de barras…"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200" />
            </div>
          </div>
          <select v-model="sortBy"
            class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200">
            <option value="id">Ordenar por ID</option>
            <option value="name">Ordenar por Nombre</option>
            <option value="price">Ordenar por Precio</option>
          </select>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th class="py-4 px-6 text-left font-semibold">ID</th>
                <th class="py-4 px-6 text-left font-semibold">SKU / Producto</th>
                <th class="py-4 px-6 text-left font-semibold">Categoría / Marca</th>
                <th class="py-4 px-6 text-left font-semibold">Precio</th>
                <th class="py-4 px-6 text-left font-semibold">Descripción</th>
                <th class="py-4 px-6 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="p in sortedProducts" :key="p.product_id"
                class="hover:bg-blue-50/50 transition-all duration-200 group">
                <td class="py-4 px-6">
                  <span
                    class="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold group-hover:bg-blue-100 group-hover:text-blue-700">
                    {{ p.product_id }}
                  </span>
                </td>

                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="relative w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg">
                      <img v-if="p.image_url" :src="p.image_url" :alt="p.name" class="w-full h-full object-cover"
                        @error="onImgError" />
                      <div v-else
                        class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {{ (p.name || 'P')[0]?.toUpperCase() }}
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 text-base leading-tight">{{ p.name }}</div>
                      <div class="text-xs text-gray-500">SKU: {{ p.sku }}</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6 text-sm text-gray-600">
                  <div>{{ p.categories?.name || '—' }}</div>
                  <div class="text-gray-500">{{ p.brands?.name || '—' }}</div>
                </td>

                <td class="py-4 px-6">
                  <span class="text-lg font-bold text-green-600">Q{{ money(p.sale_price) }}</span>
                </td>

                <td class="py-4 px-6">
                  <p class="text-gray-600 max-w-xs truncate" :title="p.description || ''">
                    {{ p.description || '—' }}
                  </p>
                </td>

                <td class="py-4 px-6">
                  <div class="flex justify-center gap-3">
                    <button
                      @click="editProduct(p.product_id)"
                      class="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 !text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl">
                      ✏️ Editar
                    </button>

                    <button
                      @click="confirmDelete(p)"
                      class="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 !text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl">
                      🗑️ Eliminar
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty -->
          <div v-if="!loading && sortedProducts.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">No hay productos</h3>
              <p class="text-gray-600">{{ search ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto' }}</p>
              <RouterLink v-if="!search" to="/products/new"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Agregar Primer Producto
              </RouterLink>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="py-10 text-center text-gray-600">Cargando…</div>
          <div v-if="error" class="py-6 text-center text-red-600">{{ error }}</div>
        </div>

        <!-- Footer: paginación simple (opcional) -->
        <div class="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
          <div class="text-sm text-gray-600">
            Mostrando {{ products.length }} resultados (total: {{ total }})
          </div>
          <div class="flex items-center gap-2">
            <button @click="prev" :disabled="page <= 1"
              class="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Anterior
            </button>
            <span class="px-3 py-2 text-gray-700">Página {{ page }}</span>
            <button @click="next" :disabled="page * pageSize >= total"
              class="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Modal eliminar -->
      <div v-if="toDelete" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="toDelete = null"></div>
        <div class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Eliminar producto</h3>
          <p class="text-gray-600 mb-4">
            ¿Seguro que deseas eliminar <span class="font-semibold">{{ toDelete?.name }}</span> (SKU {{ toDelete?.sku
            }})?
          </p>
          <div class="flex justify-end gap-2">
            <button @click="toDelete = null"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
              Cancelar
            </button>
            <button @click="doDelete" :disabled="deleting"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
              {{ deleting ? 'Eliminando…' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
