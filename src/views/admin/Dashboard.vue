<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import ApexChart from 'vue3-apexcharts';
import { format, addDays, subMilliseconds, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { getDashboard, type DashboardResp } from '../../services/admin';

// ---------- utils ----------
function toDatetimeLocal(d: Date) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}
const N = (v: unknown): number => (v == null || v === '') ? 0 : Number(v);
function money(v?: unknown) { return N(v).toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' }); }
function num(v?: unknown)   { return N(v).toLocaleString('es-GT'); }
const pct = (curr: number, prev: number) => prev === 0 ? (curr === 0 ? 0 : 100) : ((curr - prev) / prev) * 100;
const trendIcon  = (v: number) => (v > 0 ? '▲' : v < 0 ? '▼' : '—');
const trendColor = (v: number) => (v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-gray-500');

// ---------- state ----------
const from = ref(toDatetimeLocal(new Date(Date.now() - 30 * 24 * 3600 * 1000)));
const to   = ref(toDatetimeLocal(new Date()));
const data = ref<DashboardResp | null>(null);
const loading = ref(false);
const err = ref('');

// ---------- fetch ----------
async function load() {
  loading.value = true; 
  err.value = '';
  try {
    const fromISO = new Date(from.value).toISOString();
    const toISO   = new Date(to.value).toISOString();
    data.value = await getDashboard(fromISO, toISO);
  } catch (e: any) {
    err.value = e?.message ?? 'Error cargando datos';
    console.error('Error en Dashboard:', e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => { load(); });

// ---------- derivados (normalizados a number) ----------
const summary = computed(() => {
  const s = data.value?.summary;
  return s ? {
    orders: N(s.orders),
    revenue: N(s.revenue),
    gross_sales: N(s.gross_sales),
    discounts: N(s.discounts),
    taxes: N(s.taxes),
    avg_order_value: N(s.avg_order_value),
  } : null;
});

const dailySeries = computed(() =>
  (data.value?.daily ?? []).map(d => ({
    x: format(new Date(d.day), 'yyyy-MM-dd'),
    y: N(d.revenue),
  }))
);

const topProducts = computed(() =>
  (data.value?.topProducts ?? []).slice(0, 50).map(p => ({
    ...p,
    units: N((p as any).units),
    revenue: N((p as any).revenue),
  }))
);

const byPayment = computed(() =>
  (data.value?.byPayment ?? []).map(p => ({ ...p, orders: N((p as any).orders), revenue: N((p as any).revenue) }))
);

const byChannel = computed(() =>
  (data.value?.byChannel ?? []).map(c => ({ ...c, orders: N((c as any).orders), revenue: N((c as any).revenue) }))
);

const byHour = computed(() =>
  (data.value?.byHour ?? [])
    .map(h => ({ ...h, orders: N((h as any).orders), revenue: N((h as any).revenue) }))
    .slice()
    .sort((a, b) => (a as any).hour_of_day - (b as any).hour_of_day)
);

// ---------- presets de rango ----------
type PresetKey = 'today'|'7d'|'30d'|'mtd'|'ytd';
function applyPreset(p: PresetKey) {
  const now = new Date();
  if (p === 'today') {
    const start = startOfDay(now);
    from.value = toDatetimeLocal(start);
    to.value   = toDatetimeLocal(now);
  }
  if (p === '7d')  { from.value = toDatetimeLocal(addDays(now, -7));  to.value = toDatetimeLocal(now); }
  if (p === '30d') { from.value = toDatetimeLocal(addDays(now, -30)); to.value = toDatetimeLocal(now); }
  if (p === 'mtd') { from.value = toDatetimeLocal(startOfMonth(now));  to.value = toDatetimeLocal(now); }
  if (p === 'ytd') { from.value = toDatetimeLocal(startOfYear(now));   to.value = toDatetimeLocal(now); }
  load();
}

// ---------- periodo anterior para KPIs ----------
const prevPeriod = computed(() => {
  const fromD = new Date(from.value);
  const toD   = new Date(to.value);
  const duration = toD.getTime() - fromD.getTime();
  const prevTo   = subMilliseconds(fromD, 1);
  const prevFrom = new Date(prevTo.getTime() - duration);
  return { prevFrom, prevTo };
});

const prevSummary = ref<{orders:number;revenue:number;gross_sales:number;discounts:number;taxes:number;avg_order_value:number;}|null>(null);

async function loadPrevSummary() {
  try {
    const { prevFrom, prevTo } = prevPeriod.value;
    const res = await getDashboard(prevFrom.toISOString(), prevTo.toISOString());
    const s = res?.summary;
    prevSummary.value = s ? {
      orders: N(s.orders),
      revenue: N(s.revenue),
      gross_sales: N(s.gross_sales),
      discounts: N(s.discounts),
      taxes: N(s.taxes),
      avg_order_value: N(s.avg_order_value),
    } : null;
  } catch (e) {
    console.warn('No se pudo cargar periodo anterior', e);
    prevSummary.value = null;
  }
}

watchEffect(() => { if (from.value && to.value) loadPrevSummary(); });

// ---------- exportación CSV ----------
function toCSV(rows: Array<Record<string, any>>) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v:any) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return s.search(/[",\n]/) >= 0 ? `"${s}"` : s;
  };
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ];
  return lines.join('\n');
}

function download(filename: string, content: string, mime='text/csv') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportCSV() {
  const dateStamp = format(new Date(), 'yyyyMMdd_HHmm');
  const s = summary.value;
  if (s) {
    download(`resumen_${dateStamp}.csv`, toCSV([{
      pedidos: s.orders, ingresos: s.revenue, ventas_brutas: s.gross_sales,
      descuentos: s.discounts, impuestos: s.taxes, aov: s.avg_order_value
    }]));
  }
  if (dailySeries.value.length) {
    download(`ingresos_diarios_${dateStamp}.csv`, toCSV(
      dailySeries.value.map(d => ({ fecha: (d as any).x, ingresos: (d as any).y }))
    ));
  }
  if (topProducts.value.length) {
    download(`top_productos_${dateStamp}.csv`, toCSV(
      topProducts.value.map(t => ({
        id: (t as any).product_id, producto: (t as any).product_name,
        unidades: (t as any).units, ingresos: (t as any).revenue
      }))
    ));
  }
  if (byPayment.value.length) {
    download(`por_pago_${dateStamp}.csv`, toCSV(byPayment.value.map(p => ({
      metodo: (p as any).payment_method_name, pedidos: (p as any).orders, ingresos: (p as any).revenue
    }))));
  }
  if (byChannel.value.length) {
    download(`por_canal_${dateStamp}.csv`, toCSV(byChannel.value.map(c => ({
      canal: (c as any).channel, pedidos: (c as any).orders, ingresos: (c as any).revenue
    }))));
  }
}

// ---------- tabla top productos (búsqueda + orden) ----------
const prodQuery = ref('');
const prodSortKey = ref<'revenue'|'units'|'product_name'>('revenue');
const prodSortDir = ref<'desc'|'asc'>('desc');

const filteredTopProducts = computed(() => {
  const q = prodQuery.value.trim().toLowerCase();
  let arr = topProducts.value.filter(p =>
    !q || String((p as any).product_name).toLowerCase().includes(q)
  );
  arr = arr.slice().sort((a:any,b:any) => {
    const k = prodSortKey.value;
    const dir = prodSortDir.value === 'asc' ? 1 : -1;
    const av = a[k]; const bv = b[k];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
  return arr;
});

function setProdSort(k: 'revenue'|'units'|'product_name') {
  if (prodSortKey.value === k) {
    prodSortDir.value = (prodSortDir.value === 'asc') ? 'desc' : 'asc';
  } else {
    prodSortKey.value = k; prodSortDir.value = 'desc';
  }
}
</script>

<template>
  <div class="min-h-screen dashboard-container p-6 space-y-6">
    <header class="header-card flex flex-col md:flex-row md:items-end md:justify-between gap-4 p-6 border shadow-2xl">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">Dashboard de Ventas</h1>
        <p class="text-sm info-text">
          📊 Rango: {{ format(new Date(from), 'dd MMM yyyy') }} → {{ format(new Date(to), 'dd MMM yyyy') }}
        </p>
      </div>

      <div class="flex flex-col gap-3 items-stretch md:items-end">
        <!-- presets -->
        <div class="flex gap-2 flex-wrap">
          <button class="chip" @click="applyPreset('today')">Hoy</button>
          <button class="chip" @click="applyPreset('7d')">Últimos 7d</button>
          <button class="chip" @click="applyPreset('30d')">Últimos 30d</button>
          <button class="chip" @click="applyPreset('mtd')">Mes actual</button>
          <button class="chip" @click="applyPreset('ytd')">Año actual</button>
        </div>

        <div class="flex gap-3 flex-wrap">
          <input type="datetime-local" class="input-datetime rounded-xl px-4 py-2.5 focus:ring-2 focus:outline-none transition-all" v-model="from"/>
          <input type="datetime-local" class="input-datetime rounded-xl px-4 py-2.5 focus:ring-2 focus:outline-none transition-all" v-model="to"/>
          <button class="btn-update text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed" @click="load" :disabled="loading">
            {{ loading ? '⏳ Cargando...' : '🔄 Actualizar' }}
          </button>
          <button class="btn-outline rounded-xl px-4 py-2.5 font-semibold" @click="exportCSV">⬇️ Exportar CSV</button>
        </div>
      </div>
    </header>

    <div v-if="err" class="error-card rounded-2xl p-4">
      ⚠️ {{ err }}
    </div>

    <!-- KPI cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" v-if="summary">
      <div class="kpi-card group">
        <div class="kpi-icon">💰</div>
        <div class="kpi-label">Ingresos</div>
        <div class="kpi-value">{{ money(summary.revenue) }}</div>
        <div v-if="prevSummary" class="mt-1 text-sm">
          <span :class="trendColor(pct(summary.revenue, prevSummary.revenue))">
            {{ trendIcon(pct(summary.revenue, prevSummary.revenue)) }}
            {{ pct(summary.revenue, prevSummary.revenue).toFixed(1) }}%
          </span>
          <span class="text-gray-500"> vs periodo anterior</span>
        </div>
      </div>

      <div class="kpi-card group">
        <div class="kpi-icon">📦</div>
        <div class="kpi-label">Pedidos</div>
        <div class="kpi-value">{{ num(summary.orders) }}</div>
        <div v-if="prevSummary" class="mt-1 text-sm">
          <span :class="trendColor(pct(summary.orders, prevSummary.orders))">
            {{ trendIcon(pct(summary.orders, prevSummary.orders)) }}
            {{ pct(summary.orders, prevSummary.orders).toFixed(1) }}%
          </span>
          <span class="text-gray-500"> vs periodo anterior</span>
        </div>
      </div>

      <div class="kpi-card group">
        <div class="kpi-icon">💳</div>
        <div class="kpi-label">AOV</div>
        <div class="kpi-value">{{ money(summary.avg_order_value) }}</div>
        <div v-if="prevSummary" class="mt-1 text-sm">
          <span :class="trendColor(pct(summary.avg_order_value, prevSummary.avg_order_value))">
            {{ trendIcon(pct(summary.avg_order_value, prevSummary.avg_order_value)) }}
            {{ pct(summary.avg_order_value, prevSummary.avg_order_value).toFixed(1) }}%
          </span>
          <span class="text-gray-500"> vs periodo anterior</span>
        </div>
      </div>

      <div class="kpi-card group">
        <div class="kpi-icon">🏷️</div>
        <div class="kpi-label">Descuentos</div>
        <div class="kpi-value">{{ money(summary.discounts) }}</div>
        <div v-if="prevSummary" class="mt-1 text-sm">
          <span :class="trendColor(-pct(summary.discounts, prevSummary.discounts))">
            {{ trendIcon(-pct(summary.discounts, prevSummary.discounts)) }}
            {{ (-pct(summary.discounts, prevSummary.discounts)).toFixed(1) }}%
          </span>
          <span class="text-gray-500"> (menos es mejor)</span>
        </div>
      </div>

      <div class="kpi-card group">
        <div class="kpi-icon">🧾</div>
        <div class="kpi-label">Impuestos</div>
        <div class="kpi-value">{{ money(summary.taxes) }}</div>
        <div v-if="prevSummary" class="mt-1 text-sm">
          <span class="text-gray-500">vs periodo anterior</span>
        </div>
      </div>
    </section>
    <section v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div v-for="i in 5" :key="i" class="skeleton-card h-32 animate-pulse rounded-2xl"></div>
    </section>

    <!-- Línea diaria -->
    <div class="chart-card" v-if="dailySeries.length > 0">
      <h3 class="chart-title">📈 Ingresos por día</h3>
      <ApexChart
        type="area"
        height="280"
        :options="{
          chart:{ id:'daily', background:'transparent', foreColor:'#374151' },
          dataLabels:{ enabled:false },
          stroke:{ curve:'smooth', width:3 },
          fill:{ type:'gradient', gradient:{ shadeIntensity:1, opacityFrom:0.7, opacityTo:0.2 } },
          xaxis:{ type:'category', labels:{ style:{ colors:'#6b7280' } } },
          yaxis:{ labels:{ style:{ colors:'#6b7280' } } },
          grid:{ borderColor:'#e5e7eb' },
          tooltip:{ theme:'light', y:{ formatter: (v)=> money(v) } },
          colors:['#10b981']
        }"
        :series="[{ name:'Ingresos', data: dailySeries }]"
      />
    </div>

    <!-- Top productos gráficos -->
    <div class="chart-card" v-if="topProducts.length > 0">
      <h3 class="chart-title">🏆 Top productos por ingresos</h3>
      <ApexChart
        type="bar"
        height="300"
        :options="{
          chart:{ background:'transparent', foreColor:'#374151' },
          plotOptions:{ bar:{ borderRadius:8, distributed:true, horizontal:false } },
          xaxis:{ categories: topProducts.map(t=> (t as any).product_name), labels:{ style:{ colors:'#6b7280' } } },
          yaxis:{ labels:{ style:{ colors:'#6b7280' } } },
          grid:{ borderColor:'#e5e7eb' },
          tooltip:{ theme:'light', y:{ formatter:(v)=>money(v)} },
          colors:['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7'],
          legend:{ show:false }
        }"
        :series="[{ name:'Ingresos', data: topProducts.map(t=> (t as any).revenue) }]"
      />
    </div>

    <!-- Tabla Top productos -->
    <div class="chart-card" v-if="topProducts.length > 0">
      <h3 class="chart-title">🔎 Top productos (tabla)</h3>

      <div class="flex flex-wrap items-center gap-2 mb-3">
        <input v-model="prodQuery" placeholder="Buscar producto..." class="input-datetime rounded-xl px-4 py-2.5 w-full md:w-64"/>
        <div class="flex gap-1">
          <button class="chip" @click="setProdSort('revenue')">Ordenar por Ingresos</button>
          <button class="chip" @click="setProdSort('units')">Ordenar por Unidades</button>
          <button class="chip" @click="setProdSort('product_name')">Ordenar por Nombre</button>
        </div>
        <button class="btn-outline rounded-xl px-3 py-2 ml-auto" @click="
          download('top_productos_filtrados.csv', toCSV(filteredTopProducts.map(t => ({
            id: (t as any).product_id, producto: (t as any).product_name, unidades: (t as any).units, ingresos: (t as any).revenue
          }))))
        ">⬇️ Exportar tabla</button>
      </div>

      <div class="overflow-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500">
              <th class="py-2 pr-4">ID</th>
              <th class="py-2 pr-4">Producto</th>
              <th class="py-2 pr-4">Unidades</th>
              <th class="py-2 pr-4">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredTopProducts" :key="(p as any).product_id" class="border-t">
              <td class="py-2 pr-4">{{ (p as any).product_id }}</td>
              <td class="py-2 pr-4">{{ (p as any).product_name }}</td>
              <td class="py-2 pr-4">{{ num((p as any).units) }}</td>
              <td class="py-2 pr-4">{{ money((p as any).revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pago & Canal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="chart-card" v-if="byPayment.length > 0">
        <h3 class="chart-title">💳 Mezcla por método de pago</h3>
        <ApexChart
          type="donut"
          height="300"
          :options="{
            chart:{ background:'transparent' },
            labels: byPayment.map(p=> (p as any).payment_method_name),
            legend:{ labels:{ colors:'#a5b4fc' }, position:'bottom' },
            plotOptions:{ pie:{ donut:{ labels:{ show:true, total:{ show:true, color:'#fff' } } } } },
            tooltip:{ theme:'dark', y:{ formatter:(v)=>money(v)} },
            colors:['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
          }"
          :series="byPayment.map(p=> (p as any).revenue)"
        />
      </div>

      <div class="chart-card" v-if="byChannel.length > 0">
        <h3 class="chart-title">📱 Ventas por canal</h3>
        <ApexChart
          type="bar"
          height="300"
          :options="{
            chart:{ background:'transparent', foreColor:'#fff' },
            plotOptions:{ bar:{ borderRadius:8, distributed:true } },
            xaxis:{ categories: byChannel.map(c=> (c as any).channel), labels:{ style:{ colors:'#a5b4fc' } } },
            yaxis:{ labels:{ style:{ colors:'#a5b4fc' } } },
            grid:{ borderColor:'#ffffff20' },
            tooltip:{ theme:'dark', y:{ formatter:(v)=>money(v)} },
            colors:['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'],
            legend:{ show:false }
          }"
          :series="[{ name:'Ingresos', data: byChannel.map(c=> (c as any).revenue) }]"
        />
      </div>
    </div>

    <!-- Hora del día -->
    <div class="chart-card" v-if="byHour.length > 0">
      <h3 class="chart-title">⏰ Actividad por hora</h3>
      <ApexChart
        type="bar"
        height="260"
        :options="{
          chart:{ background:'transparent', foreColor:'#fff' },
          plotOptions:{ bar:{ borderRadius:6, distributed:false } },
          xaxis:{ categories: byHour.map(h=> (h as any).hour_of_day + ':00'), labels:{ style:{ colors:'#a5b4fc' } } },
          yaxis:{ labels:{ style:{ colors:'#a5b4fc' } } },
          grid:{ borderColor:'#ffffff20' },
          tooltip:{ theme:'dark' },
          colors:['#8b5cf6']
        }"
        :series="[{ name:'Pedidos', data: byHour.map(h=> (h as any).orders) }]"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 50%, #f0f4f8 100%);
}

.header-card {
  backdrop-filter: blur(12px);
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.gradient-text {
  background: linear-gradient(to right, #2563eb, #7c3aed);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.info-text { color: #6b7280; }

.input-datetime {
  background: white;
  border: 1px solid #d1d5db;
  color: #1f2937;
  backdrop-filter: blur(12px);
}
.input-datetime:focus { ring-color: #3b82f6; border-color: #3b82f6; }

.btn-update { background: linear-gradient(to right, #3b82f6, #8b5cf6); }
.btn-update:hover { background: linear-gradient(to right, #2563eb, #7c3aed); }

.btn-outline{ background:white; border:1px solid #d1d5db; color:#374151; }
.btn-outline:hover{ background:#f3f4f6; }

.error-card {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  backdrop-filter: blur(12px);
}

.skeleton-card {
  background: white;
  border: 1px solid #e5e7eb;
}

.kpi-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transform: scale(1);
  transition: all 0.3s ease;
  cursor: pointer;
}
.kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12); }
.kpi-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom right, rgba(59,130,246,.05), rgba(139,92,246,.05));
  opacity: 0; transition: opacity .3s ease;
}
.kpi-card:hover::before { opacity: 1; }

.kpi-icon { font-size: 2.25rem; margin-bottom: .75rem; transform: scale(1); transition: transform .3s ease; position: relative; z-index: 1; }
.group:hover .kpi-icon { transform: scale(1.1); }

.kpi-label { font-size: .875rem; color: #6b7280; font-weight: 500; margin-bottom: .5rem; position: relative; z-index: 1; }
.kpi-value {
  font-size: 1.875rem; font-weight: 700;
  background: linear-gradient(to right, #1f2937, #3b82f6);
  background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  position: relative; z-index: 1;
}

.chart-card {
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transform: scale(1);
  transition: all 0.3s ease;
}
.chart-card:hover { box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12); }

.chart-title {
  font-size: 1.25rem; font-weight: 700;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kpi-card, .chart-card { animation: fadeInUp .6s ease-out backwards; }
.kpi-card:nth-child(1) { animation-delay: .1s; }
.kpi-card:nth-child(2) { animation-delay: .2s; }
.kpi-card:nth-child(3) { animation-delay: .3s; }
.kpi-card:nth-child(4) { animation-delay: .4s; }
.kpi-card:nth-child(5) { animation-delay: .5s; }

.chip{
  background:#eef2ff; border:1px solid #c7d2fe; color:#4338ca;
  padding:.4rem .75rem; border-radius:9999px; font-weight:600;
  transition:all .2s ease;
}
.chip:hover{ background:#e0e7ff; transform:translateY(-1px); }

.kpi-card .text-emerald-600,.kpi-card .text-rose-600,.kpi-card .text-gray-500{ font-weight:600; }
</style>
