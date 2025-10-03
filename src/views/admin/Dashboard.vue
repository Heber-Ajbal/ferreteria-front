<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';
import { format } from 'date-fns';
import { getDashboard, type DashboardResp } from '../../services/admin';

// ---------- utils ----------
/** Convierte Date a formato válido para <input type="datetime-local"> (sin segundos, en hora local) */
function toDatetimeLocal(d: Date) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

/** Cast seguro a number para valores que pueden venir como string */
const N = (v: unknown): number => (v == null || v === '') ? 0 : Number(v);

/** Formateadores */
function money(v?: unknown) { return N(v).toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' }); }
function num(v?: unknown)   { return N(v).toLocaleString('es-GT'); }

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

onMounted(() => {
  load();
});

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
  (data.value?.topProducts ?? []).slice(0, 10).map(p => ({
    ...p,
    units: N(p.units),
    revenue: N(p.revenue),
  }))
);

const byPayment = computed(() =>
  (data.value?.byPayment ?? []).map(p => ({
    ...p,
    orders: N(p.orders),
    revenue: N(p.revenue),
  }))
);

const byChannel = computed(() =>
  (data.value?.byChannel ?? []).map(c => ({
    ...c,
    orders: N(c.orders),
    revenue: N(c.revenue),
  }))
);

const byHour = computed(() =>
  (data.value?.byHour ?? [])
    .map(h => ({ ...h, orders: N(h.orders), revenue: N(h.revenue) }))
    .slice()
    .sort((a, b) => a.hour_of_day - b.hour_of_day)
);
</script>

<template>
  <div class="min-h-screen dashboard-container p-6 space-y-6">
    <header class="header-card flex flex-col md:flex-row md:items-end md:justify-between gap-4 p-6 border shadow-2xl">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">Dashboard de Ventas</h1>
        <p class="text-sm info-text">📊 Rango: {{ format(new Date(from), 'dd MMM yyyy') }} → {{ format(new Date(to), 'dd MMM yyyy') }}</p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <input 
          type="datetime-local" 
          class="input-datetime rounded-xl px-4 py-2.5 focus:ring-2 focus:outline-none transition-all" 
          v-model="from" 
        />
        <input 
          type="datetime-local" 
          class="input-datetime rounded-xl px-4 py-2.5 focus:ring-2 focus:outline-none transition-all" 
          v-model="to" 
        />
        <button 
          class="btn-update text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="load" 
          :disabled="loading"
        >
          {{ loading ? '⏳ Cargando...' : '🔄 Actualizar' }}
        </button>
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
      </div>
      <div class="kpi-card group">
        <div class="kpi-icon">📦</div>
        <div class="kpi-label">Pedidos</div>
        <div class="kpi-value">{{ num(summary.orders) }}</div>
      </div>
      <div class="kpi-card group">
        <div class="kpi-icon">💳</div>
        <div class="kpi-label">AOV</div>
        <div class="kpi-value">{{ money(summary.avg_order_value) }}</div>
      </div>
      <div class="kpi-card group">
        <div class="kpi-icon">🏷️</div>
        <div class="kpi-label">Descuentos</div>
        <div class="kpi-value">{{ money(summary.discounts) }}</div>
      </div>
      <div class="kpi-card group">
        <div class="kpi-icon">🧾</div>
        <div class="kpi-label">Impuestos</div>
        <div class="kpi-value">{{ money(summary.taxes) }}</div>
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
          tooltip:{ theme:'light', y:{ formatter: (v:number)=> money(v) } },
          colors:['#10b981']
        }"
        :series="[{ name:'Ingresos', data: dailySeries }]"
      />
    </div>

    <!-- Top productos -->
    <div class="chart-card" v-if="topProducts.length > 0">
      <h3 class="chart-title">🏆 Top productos por ingresos</h3>
      <ApexChart
        type="bar"
        height="300"
        :options="{
          chart:{ background:'transparent', foreColor:'#374151' },
          plotOptions:{ bar:{ borderRadius:8, distributed:true, horizontal:false } },
          xaxis:{ categories: topProducts.map(t=>t.product_name), labels:{ style:{ colors:'#6b7280' } } },
          yaxis:{ labels:{ style:{ colors:'#6b7280' } } },
          grid:{ borderColor:'#e5e7eb' },
          tooltip:{ theme:'light', y:{ formatter:(v:number)=>money(v)} },
          colors:['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7'],
          legend:{ show:false }
        }"
        :series="[{ name:'Ingresos', data: topProducts.map(t=>t.revenue) }]"
      />
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
            labels: byPayment.map(p=>p.payment_method_name),
            legend:{ labels:{ colors:'#a5b4fc' }, position:'bottom' },
            plotOptions:{ pie:{ donut:{ labels:{ show:true, total:{ show:true, color:'#fff' } } } } },
            tooltip:{ theme:'dark', y:{ formatter:(v:number)=>money(v)} },
            colors:['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
          }"
          :series="byPayment.map(p=>p.revenue)"
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
            xaxis:{ categories: byChannel.map(c=>c.channel), labels:{ style:{ colors:'#a5b4fc' } } },
            yaxis:{ labels:{ style:{ colors:'#a5b4fc' } } },
            grid:{ borderColor:'#ffffff20' },
            tooltip:{ theme:'dark', y:{ formatter:(v:number)=>money(v)} },
            colors:['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'],
            legend:{ show:false }
          }"
          :series="[{ name:'Ingresos', data: byChannel.map(c=>c.revenue) }]"
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
          xaxis:{ categories: byHour.map(h=>h.hour_of_day + ':00'), labels:{ style:{ colors:'#a5b4fc' } } },
          yaxis:{ labels:{ style:{ colors:'#a5b4fc' } } },
          grid:{ borderColor:'#ffffff20' },
          tooltip:{ theme:'dark' },
          colors:['#8b5cf6']
        }"
        :series="[{ name:'Pedidos', data: byHour.map(h=>h.orders) }]"
      />
    </div>

    <!-- Debug -->
    <details v-if="data" class="debug-card rounded-2xl p-4">
      <summary class="debug-summary cursor-pointer transition-colors">🔍 Ver JSON crudo</summary>
      <pre class="text-xs mt-3 overflow-x-auto debug-pre">{{ data }}</pre>
    </details>
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

.info-text {
  color: #6b7280;
}

.input-datetime {
  background: white;
  border: 1px solid #d1d5db;
  color: #1f2937;
  backdrop-filter: blur(12px);
}

.input-datetime:focus {
  ring-color: #3b82f6;
  border-color: #3b82f6;
}

.btn-update {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
}

.btn-update:hover {
  background: linear-gradient(to right, #2563eb, #7c3aed);
}

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

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.kpi-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.kpi-card:hover::before {
  opacity: 1;
}

.kpi-icon {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  transform: scale(1);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.group:hover .kpi-icon {
  transform: scale(1.1);
}

.kpi-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.kpi-value {
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(to right, #1f2937, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
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

.chart-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.debug-card {
  backdrop-filter: blur(12px);
  background: white;
  border: 1px solid #e5e7eb;
}

.debug-summary {
  color: #3b82f6;
}

.debug-summary:hover {
  color: #2563eb;
}

.debug-pre {
  color: #374151;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card, .chart-card {
  animation: fadeInUp 0.6s ease-out backwards;
}

.kpi-card:nth-child(1) { animation-delay: 0.1s; }
.kpi-card:nth-child(2) { animation-delay: 0.2s; }
.kpi-card:nth-child(3) { animation-delay: 0.3s; }
.kpi-card:nth-child(4) { animation-delay: 0.4s; }
.kpi-card:nth-child(5) { animation-delay: 0.5s; }
</style>