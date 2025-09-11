<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useCartStore } from "../../stores/cart";
import { getProducts, getCategories, getBrands, type Product } from "../../services/products";
import { useRouter } from "vue-router";

const router = useRouter();

// estado
const loading = ref(false);
const error = ref("");

// página actual (lo que trae el backend)
const items = ref<Product[]>([]);
const page = ref(1);
const pageSize = ref(12);
const total = ref(0);

// filtros
const search = ref("");
const categoryId = ref<number>(0);
const brandId = ref<number>(0);

// catálogos
const categories = ref<Array<{ id: number; name: string }>>([]);
const brands = ref<Array<{ id: number; name: string }>>([]);

// carrito
const cart = useCartStore();

type SortKey = "popular" | "newest" | "price_asc" | "price_desc" | "reviews" | "discount";
const sortKey = ref<SortKey>("newest");

const showFilterModal = ref(false);
const showSortDropdown = ref(false);

// ---- utils
function qtz(n: number) {
  return `Q${Number(n ?? 0).toLocaleString("es-GT", { maximumFractionDigits: 2 })}`;
}

// ---- ordenamiento en cliente solo sobre la página actual
const sortedPageItems = computed(() => {
  const arr = [...items.value];
  switch (sortKey.value) {
    case "price_asc":
      return arr.sort((a, b) => (a.sale_price ?? 0) - (b.sale_price ?? 0));
    case "price_desc":
      return arr.sort((a, b) => (b.sale_price ?? 0) - (a.sale_price ?? 0));
    case "newest":
      return arr.sort((a, b) => (b.product_id ?? 0) - (a.product_id ?? 0));
    default:
      return arr;
  }
});

// total de páginas (server-side)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

// ---- data fetch
async function load() {
  loading.value = true;
  error.value = "";
  try {
    const resp = await getProducts({
      search: search.value || undefined,
      categoryId: categoryId.value || undefined,
      brandId: brandId.value || undefined,
      page: page.value,
      pageSize: pageSize.value,
    });
    items.value = resp.data;
    total.value = Number(resp.meta?.total ?? 0);
    page.value = Number(resp.meta?.page ?? page.value);
    pageSize.value = Number(resp.meta?.pageSize ?? pageSize.value);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "No se pudo cargar productos";
  } finally {
    loading.value = false;
  }
}

async function loadLookups() {
  try { categories.value = await getCategories(); } catch { categories.value = []; }
  try { brands.value = await getBrands(); } catch { brands.value = []; }
}

onMounted(async () => {
  await Promise.all([loadLookups(), load()]);
});

// ---- handlers UI
function openFilters() { showFilterModal.value = true; }
function closeFilters() { showFilterModal.value = false; }
function applyFiltersFromModal() { page.value = 1; showFilterModal.value = false; load(); }
function toggleSort() { showSortDropdown.value = !showSortDropdown.value; }
function setSort(k: SortKey) { sortKey.value = k; showSortDropdown.value = false; }

function goTo(p: number) {
  const target = Math.min(Math.max(1, p), totalPages.value);
  if (target === page.value) return;
  page.value = target;
  load(); // pide la nueva página al backend
}

let t: number | undefined;
function onSearchInput() {
  page.value = 1;
  window.clearTimeout(t);
  // @ts-ignore
  t = window.setTimeout(load, 350);
}

function resetFilters() {
  search.value = "";
  categoryId.value = 0;
  brandId.value = 0;
  sortKey.value = "newest";
  page.value = 1;
  load();
}

// al cambiar pageSize, recargar página 1 desde el backend
watch(pageSize, () => { page.value = 1; load(); });

const totalCount = computed(() => Number(total.value) || 0);

const fromIdx = computed(() => {
  if (totalCount.value === 0) return 0;
  return (page.value - 1) * pageSize.value + 1;
});

const toIdx = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.min(page.value * pageSize.value, totalCount.value);
});

// carrito
function addToCart(p: Product) {
  cart.add({ id: p.product_id, name: p.name, price: p.sale_price, qty: 1 });
}

// navegación a detalle
function goDetail(id: number | string) {
  router.push({ name: "product-detail", params: { id } });
}
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
      <p class="text-gray-600">Encuentra las mejores herramientas y accesorios para tus proyectos</p>
    </div>

    <!-- Top controls -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <!-- Filters button -->
      <button
        type="button"
        @click="openFilters"
        class="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 sm:w-auto"
      >
        <svg class="-ms-0.5 me-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
        </svg>
        Filtros
        <svg class="-me-0.5 ms-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      <!-- Sort dropdown -->
      <div class="relative">
        <button
          type="button"
          @click="toggleSort"
          class="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 sm:w-auto"
        >
          <svg class="-ms-0.5 me-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
          </svg>
          Ordenar
          <svg class="-me-0.5 ms-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>

        <div v-show="showSortDropdown" class="absolute z-50 mt-2 w-44 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white shadow">
          <ul class="p-2 text-left text-sm font-medium text-gray-700">
            <li><button @click="setSort('popular')" class="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100" :class="{'text-blue-700': sortKey==='popular'}">Más popular</button></li>
            <li><button @click="setSort('newest')" class="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100" :class="{'text-blue-700': sortKey==='newest'}">Novedades</button></li>
            <li><button @click="setSort('price_asc')" class="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100" :class="{'text-blue-700': sortKey==='price_asc'}">Precio ↑</button></li>
            <li><button @click="setSort('price_desc')" class="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100" :class="{'text-blue-700': sortKey==='price_desc'}">Precio ↓</button></li>
          </ul>
        </div>
      </div>

      <!-- Search -->
      <div class="ml-auto w-full sm:w-64">
        <input
          v-model="search"
          @input="onSearchInput"
          type="search"
          placeholder="Buscar producto, SKU…"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Modal filtros -->
    <div v-if="showFilterModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="closeFilters"></div>
      <div class="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Filtros</h3>
          <button @click="closeFilters" class="rounded p-1 hover:bg-gray-100">✕</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="categories.length">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model.number="categoryId" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option :value="0">Todas</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div v-if="brands.length">
            <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <select v-model.number="brandId" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option :value="0">Todas</option>
              <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Items por página</label>
            <select v-model.number="pageSize" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button @click="resetFilters" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Limpiar</button>
          <button @click="applyFiltersFromModal" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Aplicar filtros</button>
        </div>
      </div>
    </div>

    <!-- Estados -->
    <div v-if="loading" class="py-10 text-center text-gray-600">Cargando productos…</div>
    <div v-else-if="error" class="py-10 text-center text-red-600">{{ error }}</div>
    <div v-else-if="!sortedPageItems.length" class="py-10 text-center text-gray-600">
      No se encontraron productos con esos filtros.
    </div>

    <!-- Resumen conteo -->
    <div v-if="!loading && totalCount" class="mb-3 text-sm text-gray-600">
      Mostrando {{ fromIdx }}–{{ toIdx }} de {{ totalCount }} resultados
    </div>

    <!-- Grid -->
    <div v-if="!loading && !error && sortedPageItems.length" class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="p in sortedPageItems"
        :key="p.product_id"
        role="button"
        tabindex="0"
        @click="goDetail(p.product_id)"
        @keydown.enter.prevent="goDetail(p.product_id)"
        @keydown.space.prevent="goDetail(p.product_id)"
        class="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <!-- Imagen -->
        <div class="h-56 w-full relative">
          <img
            class="mx-auto h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            :src="p.image_url || 'https://via.placeholder.com/600x400?text=Producto'"
            :alt="p.name"
          />
          <span
            v-if="p.stock !== undefined && p.stock <= 0"
            class="absolute top-2 left-2 rounded bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white"
          >
            Agotado
          </span>
        </div>

        <div class="pt-5">
          <!-- Nombre -->
          <h3 class="text-lg font-semibold leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-700">
            {{ p.name }}
          </h3>

          <!-- Meta -->
          <div class="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
            <span v-if="p.categories?.name">Cat: {{ p.categories.name }}</span>
            <span v-if="p.brands?.name">Marca: {{ p.brands.name }}</span>
          </div>

          <!-- Precio + Agregar -->
          <div class="mt-4 flex items-center justify-between gap-4">
            <p class="text-2xl font-extrabold leading-tight text-gray-900">
              {{ qtz(p.sale_price) }}
            </p>
            <button
              type="button"
              :disabled="p.stock !== undefined && p.stock <= 0"
              class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
              @click.stop="addToCart(p)"
              :aria-label="`Agregar ${p.name} al carrito`"
            >
              <svg class="-ms-1 me-2 h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
              </svg>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        @click="goTo(page - 1)"
        :disabled="page <= 1"
        class="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Anterior
      </button>

      <span class="px-3 py-2 text-gray-700">Página {{ page }} de {{ totalPages }}</span>

      <button
        @click="goTo(page + 1)"
        :disabled="page >= totalPages"
        class="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
