<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getStock } from '../../services/purchases';
// Si tienes alias @ usa: import { generateStockPDF } from '@/utils/stockReport';
import { generateStockPDF } from '../../utils/stockReport';

type Row = { productId:number; name:string; stock:number };

const rows = ref<Row[]>([]);
const q = ref(''); // búsqueda global

// ── Filtros por columna ─────────────────────────────────────────────
const idFilter     = ref<string>('');     // busca por ID exacto o parcial
const nameFilter   = ref<string>('');     // por nombre
const statusFilter = ref<string>('');     // '', 'Sin stock', 'Stock bajo', 'Stock medio', 'Stock alto'
const stockMin     = ref<string>('');     // num como string para inputs
const stockMax     = ref<string>('');     // num como string para inputs

// ── Ordenación ──────────────────────────────────────────────────────
type SortKey = 'productId' | 'name' | 'status' | 'stock';
const sortBy  = ref<SortKey>('stock');   // por defecto: cantidad
const sortDir = ref<'asc' | 'desc'>('desc');

const toggleSort = (key: SortKey) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    if (key === 'name' || key === 'status') sortDir.value = 'asc';
    else if (key === 'stock')               sortDir.value = 'desc';
    else                                    sortDir.value = 'asc';
  }
};

onMounted(async ()=>{ rows.value = await getStock(); });

// Utilidades originales
const getStockColor = (stock: number) => {
  if (stock === 0) return 'text-red-600 bg-red-50';
  if (stock < 10) return 'text-orange-600 bg-orange-50';
  if (stock < 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'Sin stock';
  if (stock < 10) return 'Stock bajo';
  if (stock < 50) return 'Stock medio';
  return 'Stock alto';
};

// Mapa para ordenar por estado
const statusRank = (s: string) => {
  switch (s) {
    case 'Sin stock':  return 0;
    case 'Stock bajo': return 1;
    case 'Stock medio':return 2;
    case 'Stock alto': return 3;
    default: return -1;
  }
};

// Filtro global
const globalFiltered = computed(() =>
  rows.value.filter(r =>
    r.name.toLowerCase().includes(q.value.toLowerCase()) ||
    String(r.productId).includes(q.value)
  )
);

// Filtros por columna + orden
const filtered = computed(() => {
  const min = stockMin.value === '' ? -Infinity : Number(stockMin.value);
  const max = stockMax.value === '' ?  Infinity : Number(stockMax.value);

  let out = globalFiltered.value.filter(r => {
    const passId     = idFilter.value.trim() === '' ? true : String(r.productId).includes(idFilter.value.trim());
    const passName   = nameFilter.value.trim() === '' ? true : r.name.toLowerCase().includes(nameFilter.value.trim().toLowerCase());
    const s          = getStockStatus(r.stock);
    const passStatus = statusFilter.value === '' ? true : s === statusFilter.value;
    const passMin    = Number.isFinite(min) ? r.stock >= min : true;
    const passMax    = Number.isFinite(max) ? r.stock <= max : true;
    return passId && passName && passStatus && passMin && passMax;
  });

  out.sort((a, b) => {
    let cmp = 0;
    if (sortBy.value === 'productId')      cmp = a.productId - b.productId;
    else if (sortBy.value === 'name')      cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    else if (sortBy.value === 'stock')     cmp = a.stock - b.stock;
    else if (sortBy.value === 'status')    cmp = statusRank(getStockStatus(a.stock)) - statusRank(getStockStatus(b.stock));
    return sortDir.value === 'asc' ? cmp : -cmp;
  });

  return out;
});

// Icono de orden (ligero)
const sortIcon = (key: SortKey) => {
  if (sortBy.value !== key) return '⇅';
  return sortDir.value === 'asc' ? '↑' : '↓';
};

// ── Solo PDF ────────────────────────────────────────────────────────
function onPDF(){
  // Llama a tu utilidad con filas ya filtradas/ordenadas y filtros activos
  generateStockPDF(
    filtered.value,
    {
      q: q.value,
      idFilter: idFilter.value,
      nameFilter: nameFilter.value,
      statusFilter: statusFilter.value,
      stockMin: stockMin.value,
      stockMax: stockMax.value,
    },
    {
      title: 'Inventario de Stock',
      // filename: 'reporte_stock.pdf', // opcional
      // logoBase64: 'iVBORw0K...'      // opcional
    }
  );
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventario de Stock
          </h1>
          <p class="text-gray-600 mt-2">{{ filtered.length }} productos encontrados</p>
        </div>

        <!-- KPI + Botón PDF -->
        <div class="flex items-center gap-3">
          <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div class="text-sm text-gray-600">Total productos</div>
            <div class="text-3xl font-bold text-blue-600">{{ rows.length }}</div>
          </div>

          <button
            @click="onPDF"
            class="inline-flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold border border-gray-200 bg-white shadow-lg hover:shadow-xl transition active:scale-[.98]"
            title="Exportar a PDF"
          >
            <!-- ícono PDF -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 9V3h10v6" stroke="currentColor" stroke-width="1.5"/>
              <rect x="5" y="9" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 19h10v2H7z" fill="currentColor"/>
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      <!-- Search Bar (global) -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"></div>
        <input
          class="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg shadow-sm"
          placeholder="Buscar por nombre o ID del producto..."
          v-model="q"
        />
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  <button
                    class="inline-flex items-center gap-2"
                    @click="toggleSort('productId')"
                    title="Ordenar por ID"
                  >
                    ID <span class="opacity-80 text-xs">{{ sortIcon('productId') }}</span>
                  </button>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  <button
                    class="inline-flex items-center gap-2"
                    @click="toggleSort('name')"
                    title="Ordenar por Producto"
                  >
                    Producto <span class="opacity-80 text-xs">{{ sortIcon('name') }}</span>
                  </button>
                </th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                  <button
                    class="inline-flex items-center gap-2"
                    @click="toggleSort('status')"
                    title="Ordenar por Estado"
                  >
                    Estado <span class="opacity-80 text-xs">{{ sortIcon('status') }}</span>
                  </button>
                </th>
                <th class="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                  <button
                    class="inline-flex items-center gap-2 float-right"
                    @click="toggleSort('stock')"
                    title="Ordenar por Cantidad"
                  >
                    Cantidad <span class="opacity-80 text-xs">{{ sortIcon('stock') }}</span>
                  </button>
                </th>
              </tr>

              <!-- Fila de filtros por columna -->
              <tr class="bg-white/70 backdrop-blur">
                <th class="px-6 py-3">
                  <input
                    v-model="idFilter"
                    type="text"
                    inputmode="numeric"
                    placeholder="Filtrar ID..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </th>
                <th class="px-6 py-3">
                  <input
                    v-model="nameFilter"
                    type="text"
                    placeholder="Filtrar nombre..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </th>
                <th class="px-6 py-3 text-center">
                  <select
                    v-model="statusFilter"
                    class="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Todos</option>
                    <option>Sin stock</option>
                    <option>Stock bajo</option>
                    <option>Stock medio</option>
                    <option>Stock alto</option>
                  </select>
                </th>
                <th class="px-6 py-3">
                  <div class="flex items-center gap-2 justify-end">
                    <input
                      v-model="stockMin"
                      type="number"
                      min="0"
                      placeholder="Mín"
                      class="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-right"
                    />
                    <span class="text-gray-400">—</span>
                    <input
                      v-model="stockMax"
                      type="number"
                      min="0"
                      placeholder="Máx"
                      class="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-right"
                    />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="r in filtered"
                :key="r.productId"
                class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                <td class="px-6 py-4">
                  <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm shadow-md">
                    {{ r.productId }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900 text-lg">{{ r.name }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="getStockColor(r.stock)"
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  >
                    <span class="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                    {{ getStockStatus(r.stock) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {{ r.stock }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="filtered.length === 0" class="py-16 text-center">
            <svg class="mx-auto w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p class="text-gray-500">Ajusta los filtros o la búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
