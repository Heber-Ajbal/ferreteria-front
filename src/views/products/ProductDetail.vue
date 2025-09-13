<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProduct, getProducts, type Product } from "../../services/products";
import { useCartStore } from "../../stores/cart";

// ------- Utils -------
const toNum = (v: any, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const qtz = (n?: any) => `Q${toNum(n, 0).toLocaleString("es-GT",{ maximumFractionDigits: 2 })}`;
const fmtDate = (iso?: string) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("es-GT", { year: "numeric", month: "short", day: "2-digit" }); }
  catch { return iso; }
};

// ------- State -------
const route = useRoute();
const router = useRouter();
const cart = useCartStore();

type ProductDetail = {
  product_id: number;
  sku?: string;
  name: string;
  category_id?: number;
  brand_id?: number;
  unit_id?: number;
  barcode?: string;
  description?: string;
  cost_price?: string | number | null;
  sale_price?: string | number | null;
  is_taxable?: boolean | number;
  min_stock?: string | number | null;
  created_at?: string;
  image_url?: string | null; // por si luego lo agregan
  categories?: { category_id: number; name: string; description?: string | null };
  brands?: { brand_id: number; name: string };
  units?: { unit_id: number; code: string; name: string };
};

const loading = ref(false);
const error = ref("");
const product = ref<ProductDetail | null>(null);
const qty = ref(1);
const adding = ref(false);
const related = ref<Product[]>([]);

const brandId = computed(() => product.value?.brands?.brand_id);
const categoryId = computed(() => product.value?.categories?.category_id);
const salePrice = computed(() => toNum(product.value?.sale_price, 0));
const costPrice = computed(() => toNum(product.value?.cost_price, 0));
const minStock = computed(() => toNum(product.value?.min_stock, 0));
const isTaxable = computed(() => !!product.value?.is_taxable);
const unitName = computed(() => product.value?.units?.name ?? "");
const brandName = computed(() => product.value?.brands?.name ?? "");
const categoryName = computed(() => product.value?.categories?.name ?? "");
const createdAt = computed(() => fmtDate(product.value?.created_at));

const hasDiscount = computed(() => costPrice.value > salePrice.value && salePrice.value > 0);
const discountPct = computed(() => {
  if (!hasDiscount.value) return 0;
  return Math.round((1 - salePrice.value / costPrice.value) * 100);
});

async function load(id: number) {
  loading.value = true;
  error.value = "";
  product.value = null;
  related.value = [];
  try {
    const p = await getProduct(id);
    product.value = p;

    // Relacionados por marca
    if (p?.brands?.brand_id) {
      const resp = await getProducts({ brandId: p.brands.brand_id, page: 1, pageSize: 8 });
      related.value = (resp.data || []).filter(x => x.product_id !== p.product_id).slice(0, 4);
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || "No se pudo cargar el producto";
  } finally {
    loading.value = false;
  }
}

function dec() { qty.value = Math.max(1, qty.value - 1); }
function inc() { qty.value = Math.max(1, qty.value + 1); }

async function addToCart() {
  if (!product.value) return;
  adding.value = true;
  try {
    cart.add({
      id: product.value.product_id,
      name: product.value.name,
      price: salePrice.value,
      qty: qty.value,
      image_url: product.value.image_url
    });
  } finally {
    adding.value = false;
  }
}

function goFilterByBrand() {
  if (!brandId.value) return;
  router.push({ path: "/", query: { brandId: String(brandId.value) } });
}
function goFilterByCategory() {
  if (!categoryId.value) return;
  router.push({ path: "/", query: { categoryId: String(categoryId.value) } });
}

onMounted(() => load(Number(route.params.id)));
watch(() => route.params.id, (v) => v && load(Number(v)));
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0 py-8">

    <!-- Estados -->
    <div v-if="loading" class="py-10 text-center text-gray-600">Cargando…</div>
    <div v-else-if="error" class="py-10 text-center text-red-600">{{ error }}</div>
    <div v-else-if="!product" class="py-10 text-center text-gray-600">No encontrado</div>

    <!-- Contenido -->
    <div v-else class="grid gap-8 lg:grid-cols-5">
      <!-- Galería -->
      <div class="lg:col-span-3">
        <div class="border rounded-2xl p-4 bg-white shadow-sm">
          <img
            :src="product.image_url || 'https://via.placeholder.com/1000x750?text=Producto'"
            :alt="product.name"
            class="w-full max-h-[540px] object-contain"
          />
          <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span v-if="product.sku" class="inline-flex items-center gap-1">
              <span class="px-2 py-0.5 rounded bg-gray-100">SKU</span> {{ product.sku }}
            </span>
            <span v-if="product.barcode" class="inline-flex items-center gap-1">
              <span class="px-2 py-0.5 rounded bg-gray-100">Código</span> {{ product.barcode }}
            </span>
            <span v-if="unitName" class="inline-flex items-center gap-1">
              <span class="px-2 py-0.5 rounded bg-gray-100">Unidad</span> {{ unitName }}
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 class="mb-2 text-lg font-semibold text-gray-900">Descripción</h2>
          <p class="text-gray-700 whitespace-pre-line">
            {{ product.description || "Sin descripción." }}
          </p>
        </div>

        <!-- Ficha técnica -->
        <div class="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Ficha técnica</h2>
          <div class="grid sm:grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between rounded-lg border p-3">
              <span class="text-gray-500">Marca</span>
              <button v-if="brandName" @click="goFilterByBrand" class="text-blue-600 hover:underline">
                {{ brandName }}
              </button>
            </div>
            <div class="flex justify-between rounded-lg border p-3">
              <span class="text-gray-500">Categoría</span>
              <button v-if="categoryName" @click="goFilterByCategory" class="text-blue-600 hover:underline">
                {{ categoryName }}
              </button>
            </div>
            <div class="flex justify-between rounded-lg border p-3" v-if="minStock">
              <span class="text-gray-500">Stock</span>
              <span>{{ minStock }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de compra -->
      <aside class="lg:col-span-2">
        <div class="sticky top-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold text-gray-900">{{ product.name }}</h1>
            <span v-if="hasDiscount" class="ml-auto inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              -{{ discountPct }}%
            </span>
          </div>

          <div class="mt-3 flex items-end gap-3">
            <p class="text-3xl font-extrabold text-gray-900">{{ qtz(salePrice) }}</p>
            <p v-if="hasDiscount" class="text-sm text-gray-500 line-through">{{ qtz(costPrice) }}</p>
          </div>

          <div class="mt-1 text-xs text-gray-500">
            Precio por {{ unitName || 'unidad' }} • {{ isTaxable ? 'Aplica IVA (12%)' : 'Exento de IVA' }}
          </div>

          <!-- Cantidad + Agregar -->
          <div class="mt-6 flex items-stretch gap-3">
            <div class="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              <button @click="dec" class="px-3 py-2 hover:bg-gray-50">–</button>
              <input v-model.number="qty" type="number" min="1" class="w-16 text-center outline-none border-l border-r border-gray-300" />
              <button @click="inc" class="px-3 py-2 hover:bg-gray-50">+</button>
            </div>

            <button
              type="button"
              :disabled="adding"
              @click="addToCart"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
            >
              <svg class="-ms-1 me-2 h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
              </svg>
              Agregar al carrito
            </button>
          </div>

          <!-- Badges -->
          <div class="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span v-if="categoryName" class="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-gray-700">
              {{ categoryName }}
            </span>
            <span v-if="brandName" class="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-gray-700">
              {{ brandName }}
            </span>
            <span class="inline-flex items-center rounded bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
              {{ unitName || 'Unidad' }}
            </span>
          </div>

          <!-- Info extra estilo Flowbite -->
          <div class="mt-6 grid gap-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Retiro en tienda disponible
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span>
              Entregas en 24–48h en la capital
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Relacionados -->
    <div v-if="related.length" class="mt-10">
      <h2 class="mb-4 text-lg font-semibold text-gray-900">Productos relacionados</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <router-link
          v-for="r in related"
          :key="r.product_id"
          :to="{ name: 'product-detail', params: { id: r.product_id } }"
          class="rounded-lg border border-gray-200 bg-white p-4 hover:shadow transition"
        >
          <img
            :src="(r as any).image_url || 'https://via.placeholder.com/600x400?text=Producto'"
            :alt="r.name"
            class="h-40 w-full object-contain"
          />
          <div class="mt-3">
            <p class="line-clamp-2 font-medium text-gray-900">{{ r.name }}</p>
            <p class="mt-1 text-sm text-gray-700">{{ qtz((r as any).sale_price) }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
