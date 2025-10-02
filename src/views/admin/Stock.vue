<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getStock } from '../../services/purchases';

const rows = ref<{productId:number; name:string; stock:number}[]>([]);
const q = ref('');
onMounted(async ()=>{ rows.value = await getStock(); });
const filtered = computed(()=> rows.value.filter(r => r.name.toLowerCase().includes(q.value.toLowerCase()) || String(r.productId).includes(q.value)));
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Stock</h1>
    <input class="border rounded px-3 py-2" placeholder="Buscar..." v-model="q" />
    <table class="w-full text-sm border rounded-2xl overflow-hidden">
      <thead class="bg-gray-50"><tr><th class="p-2 text-left">ID</th><th class="p-2 text-left">Producto</th><th class="p-2 text-right">Stock</th></tr></thead>
      <tbody>
        <tr v-for="r in filtered" :key="r.productId" class="border-t">
          <td class="p-2">{{ r.productId }}</td>
          <td class="p-2">{{ r.name }}</td>
          <td class="p-2 text-right">{{ r.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
