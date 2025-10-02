<script setup lang="ts">
import { ref } from 'vue';
import { createPurchase, receivePurchase } from '../../services/purchases';
import { useAuthStore } from "../../stores/auth";   


const supplierId = ref(1);
const invoiceNumber = ref('');
const purchaseDate = ref(new Date().toISOString().slice(0,10));
const items = ref([{ productId: 1, qty: 10, unitCost: 25 }]);

const auth = useAuthStore();  

const createdId = ref<number|null>(null);
const msg = ref('');

function addRow(){ items.value.push({ productId:0, qty:1, unitCost:0 }); }
function removeRow(i:number){ items.value.splice(i,1); }
function updateRow(i:number, key:'productId'|'qty'|'unitCost', val:any) { (items.value[i] as any)[key] = Number(val); }

async function submit(){
  try{
    const payload = { supplierId: supplierId.value, invoiceNumber: invoiceNumber.value, purchaseDate: purchaseDate.value, items: items.value.filter(i=>i.productId>0 && i.qty>0) };
    const res = await createPurchase(payload);
    createdId.value = res.purchaseId;
    msg.value = `Compra creada #${res.purchaseId} (${res.status})`;
  }catch(e:any){ msg.value = e.message; }
}

async function receive(){
  if (!createdId.value) return;
  try {
    console.log(auth.user?.userId)
    const res = await receivePurchase(createdId.value,auth.user?.userId);
    msg.value = `Compra recibida #${res.purchaseId} (sub Q${res.subtotal}, IVA Q${res.tax})`;
  } catch(e:any){ msg.value = e.message; }
}
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Compras</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <label class="flex flex-col">Proveedor ID
        <input type="number" class="border rounded px-3 py-2" v-model.number="supplierId" />
      </label>
      <label class="flex flex-col">Factura
        <input class="border rounded px-3 py-2" v-model="invoiceNumber" />
      </label>
      <label class="flex flex-col">Fecha
        <input type="date" class="border rounded px-3 py-2" v-model="purchaseDate" />
      </label>
    </div>

    <div class="border rounded-2xl p-3">
      <div class="flex justify-between items-center mb-2">
        <div class="font-semibold">Ítems</div>
        <button class="px-3 py-1 border rounded" @click="addRow">+ Agregar</button>
      </div>
      <table class="w-full text-sm">
        <thead><tr class="text-left">
          <th class="p-2">Producto ID</th><th class="p-2">Cantidad</th><th class="p-2">Costo Unitario</th><th></th>
        </tr></thead>
        <tbody>
          <tr v-for="(r,i) in items" :key="i" class="border-t">
            <td class="p-2"><input type="number" class="border rounded px-2 py-1 w-28" :value="r.productId" @input="updateRow(i,'productId',($event.target as HTMLInputElement).value)"/></td>
            <td class="p-2"><input type="number" class="border rounded px-2 py-1 w-28" :value="r.qty" @input="updateRow(i,'qty',($event.target as HTMLInputElement).value)"/></td>
            <td class="p-2"><input type="number" step="0.01" class="border rounded px-2 py-1 w-28" :value="r.unitCost" @input="updateRow(i,'unitCost',($event.target as HTMLInputElement).value)"/></td>
            <td class="p-2 text-right"><button class="px-2 py-1 border rounded" @click="removeRow(i)">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex gap-2">
      <button class="px-4 py-2 border rounded" @click="submit">Guardar compra</button>
      <button class="px-4 py-2 border rounded disabled:opacity-50" :disabled="!createdId" @click="receive">Recibir</button>
    </div>

    <div v-if="msg" class="text-sm text-blue-600">{{ msg }}</div>
  </div>
</template>
