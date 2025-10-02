<script setup lang="ts">
import { ref, onMounted, computed, defineComponent } from 'vue';
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

// ---------- componentes locales (Kpi, Card) ----------
const Kpi = defineComponent({
  name: 'Kpi',
  props: { title: { type: String, required: true }, value: { type: String, required: true } },
  template: `
    <div class="rounded-2xl border p-4">
      <div class="text-sm text-gray-500">{{ title }}</div>
      <div class="text-2xl font-semibold">{{ value }}</div>
    </div>
  `
});

const Card = defineComponent({
  name: 'Card',
  props: { title: { type: String, required: true } },
  template: `
    <div class="rounded-2xl border p-4">
      <div class="text-lg font-semibold mb-2">{{ title }}</div>
      <slot />
    </div>
  `
});

// ---------- state ----------
const from = ref(toDatetimeLocal(new Date(Date.now() - 30 * 24 * 3600 * 1000)));
const to   = ref(toDatetimeLocal(new Date()));
const data = ref<DashboardResp | null>(null);
const loading = ref(false);
const err = ref('');

// ---------- fetch ----------
async function load() {
  loading.value = true; err.value = '';
  try {
    // Si tu API espera rango en ISO UTC:
    const fromISO = new Date(from.value).toISOString();
    const toISO   = new Date(to.value).toISOString();
    data.value = await getDashboard(fromISO, toISO);
  } catch (e: any) {
    err.value = e?.message ?? 'Error';
  } finally {
    loading.value = false;
  }
}
onMounted(load);

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
  <div class="p-6 space-y-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Dashboard de Ventas</h1>
        <p class="text-sm text-gray-500">Rango: {{ from }} → {{ to }}</p>
      </div>
      <div class="flex gap-2">
        <input type="datetime-local" class="border rounded-xl px-3 py-2" v-model="from" />
        <input type="datetime-local" class="border rounded-xl px-3 py-2" v-model="to" />
        <button class="border rounded-xl px-3 py-2" @click="load" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Actualizar' }}
        </button>
      </div>
    </header>

    <div v-if="err" class="text-red-600 text-sm">{{ err }}</div>

    <!-- KPI cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" v-if="summary">
      <Kpi title="Ingresos"   :value="money(summary.revenue)" />
      <Kpi title="Pedidos"    :value="num(summary.orders)" />
      <Kpi title="AOV"        :value="money(summary.avg_order_value)" />
      <Kpi title="Descuentos" :value="money(summary.discounts)" />
      <Kpi title="Impuestos"  :value="money(summary.taxes)" />
    </section>
    <section v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div v-for="i in 5" :key="i" class="h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
    </section>

    <!-- Línea diaria -->
    <Card title="Ingresos por día">
      <ApexChart
        type="area"
        height="280"
        :options="{
          chart:{ id:'daily' },
          dataLabels:{ enabled:false },
          stroke:{ curve:'smooth' },
          xaxis:{ type:'category' },
          tooltip:{ y:{ formatter: (v:number)=> money(v) } }
        }"
        :series="[{ name:'Ingresos', data: dailySeries }]"
      />
    </Card>

    <!-- Top productos -->
    <Card title="Top productos por ingresos">
      <ApexChart
        type="bar"
        height="300"
        :options="{
          xaxis:{ categories: topProducts.map(t=>t.product_name) },
          tooltip:{ y:{ formatter:(v:number)=>money(v)} }
        }"
        :series="[{ name:'Ingresos', data: topProducts.map(t=>t.revenue) }]"
      />
    </Card>

    <!-- Pago & Canal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Mezcla por método de pago">
        <ApexChart
          type="pie"
          height="300"
          :options="{
            labels: byPayment.map(p=>p.payment_method_name),
            tooltip:{ y:{ formatter:(v:number)=>money(v)} }
          }"
          :series="byPayment.map(p=>p.revenue)"
        />
      </Card>

      <Card title="Ventas por canal">
        <ApexChart
          type="bar"
          height="300"
          :options="{
            xaxis:{ categories: byChannel.map(c=>c.channel) },
            tooltip:{ y:{ formatter:(v:number)=>money(v)} }
          }"
          :series="[{ name:'Ingresos', data: byChannel.map(c=>c.revenue) }]"
        />
      </Card>
    </div>

    <!-- Hora del día -->
    <Card title="Actividad por hora">
      <ApexChart
        type="bar"
        height="260"
        :options="{ xaxis:{ categories: byHour.map(h=>h.hour_of_day) } }"
        :series="[{ name:'Pedidos', data: byHour.map(h=>h.orders) }]"
      />
    </Card>

    <!-- Fallback de debug para ver si llega data -->
    <details v-if="data" class="text-xs text-gray-500">
      <summary>Ver JSON crudo</summary>
      <pre>{{ data }}</pre>
    </details>
  </div>
</template>

<style scoped>
/* estilos extra si los necesitas */
</style>
