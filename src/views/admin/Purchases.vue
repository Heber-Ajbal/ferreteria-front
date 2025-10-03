<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createPurchase, receivePurchase, getStock } from '../../services/purchases';
import { useAuthStore } from "../../stores/auth";   

const supplierId = ref(1);
const invoiceNumber = ref('');
const purchaseDate = ref(new Date().toISOString().slice(0,10));
const items = ref([{ productId: 1, qty: 10, unitCost: 25 }]);
const products = ref<{productId:number; name:string; stock:number}[]>([]);

const auth = useAuthStore();  

const createdId = ref<number|null>(null);
const msg = ref('');
const msgType = ref<'success'|'error'>('success');

onMounted(async ()=>{ 
  products.value = await getStock(); 
});

function addRow(){ items.value.push({ productId:0, qty:1, unitCost:0 }); }
function removeRow(i:number){ items.value.splice(i,1); }
function updateRow(i:number, key:'productId'|'qty'|'unitCost', val:any) { (items.value[i] as any)[key] = Number(val); }

function getProductName(productId: number) {
  const product = products.value.find(p => p.productId === productId);
  return product ? product.name : 'Producto no encontrado';
}

const totalItems = ref(0);
const totalCost = ref(0);

function calculateTotals() {
  totalItems.value = items.value.reduce((sum, item) => sum + (item.qty || 0), 0);
  totalCost.value = items.value.reduce((sum, item) => sum + ((item.qty || 0) * (item.unitCost || 0)), 0);
}

async function submit(){
  try{
    const payload = { 
      supplierId: supplierId.value, 
      invoiceNumber: invoiceNumber.value, 
      purchaseDate: purchaseDate.value, 
      items: items.value.filter(i=>i.productId>0 && i.qty>0) 
    };
    const res = await createPurchase(payload);
    createdId.value = res.purchaseId;
    msg.value = `✅ Compra creada exitosamente #${res.purchaseId} (${res.status})`;
    msgType.value = 'success';
    calculateTotals();
  }catch(e:any){ 
    msg.value = `❌ Error: ${e.message}`; 
    msgType.value = 'error';
  }
}

async function receive(){
  if (!createdId.value) return;
  try {
    const res = await receivePurchase(createdId.value, auth.user?.userId);
    msg.value = `✅ Compra recibida #${res.purchaseId} - Subtotal: Q${res.subtotal.toLocaleString()}, IVA: Q${res.tax.toLocaleString()}`;
    msgType.value = 'success';
  } catch(e:any){ 
    msg.value = `❌ Error: ${e.message}`; 
    msgType.value = 'error';
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🛒 Gestión de Compras
          </h1>
          <p class="text-gray-600 mt-2">Registra y administra las compras a proveedores</p>
        </div>
        
        <!-- Stats Cards -->
        <div class="flex gap-3">
          <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div class="text-sm text-gray-600">Items totales</div>
            <div class="text-3xl font-bold text-blue-600">{{ totalItems }}</div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div class="text-sm text-gray-600">Costo total</div>
            <div class="text-3xl font-bold text-green-600">Q{{ totalCost.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Alert Message -->
      <div 
        v-if="msg" 
        :class="msgType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'"
        class="rounded-2xl border-2 p-4 shadow-lg animate-pulse"
      >
        <p class="font-semibold">{{ msg }}</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
        <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
          <span class="text-3xl">📋</span>
          <h2 class="text-2xl font-bold text-gray-900">Información de la Compra</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              🏢 Proveedor ID *
            </label>
            <input 
              type="number" 
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none" 
              v-model.number="supplierId"
              placeholder="Ingrese ID del proveedor"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              📄 Número de Factura *
            </label>
            <input 
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none" 
              v-model="invoiceNumber"
              placeholder="Ej: FAC-001"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              📅 Fecha de Compra *
            </label>
            <input 
              type="date" 
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none" 
              v-model="purchaseDate"
            />
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📦</span>
            <h2 class="text-2xl font-bold">Productos de la Compra</h2>
          </div>
          <button 
            class="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            @click="addRow"
          >
            ➕ Agregar Producto
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b-2 border-gray-200">
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Producto
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Cantidad
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Costo Unitario (Q)
                </th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Subtotal (Q)
                </th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="(r,i) in items" 
                :key="i" 
                class="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200"
              >
                <td class="px-6 py-4">
                  <select 
                    class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" 
                    :value="r.productId" 
                    @change="updateRow(i,'productId',($event.target as HTMLSelectElement).value)"
                  >
                    <option value="0">Seleccionar producto...</option>
                    <option 
                      v-for="product in products" 
                      :key="product.productId" 
                      :value="product.productId"
                    >
                      {{ product.name }} (Stock: {{ product.stock }})
                    </option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <input 
                    type="number" 
                    class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" 
                    :value="r.qty" 
                    @input="updateRow(i,'qty',($event.target as HTMLInputElement).value)"
                    placeholder="0"
                  />
                </td>
                <td class="px-6 py-4">
                  <input 
                    type="number" 
                    step="0.01" 
                    class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none" 
                    :value="r.unitCost" 
                    @input="updateRow(i,'unitCost',($event.target as HTMLInputElement).value)"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-lg font-bold text-gray-900">
                    Q{{ ((r.qty || 0) * (r.unitCost || 0)).toFixed(2) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button 
                    class="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all shadow-sm hover:shadow-md"
                    @click="removeRow(i)"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gradient-to-r from-green-50 to-blue-50 border-t-2 border-gray-200">
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-bold text-gray-700 text-lg">
                  TOTAL:
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Q{{ items.reduce((sum, item) => sum + ((item.qty || 0) * (item.unitCost || 0)), 0).toFixed(2) }}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <!-- Empty State -->
          <div v-if="items.length === 0" class="py-16 text-center">
            <div class="text-6xl mb-4">📦</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No hay productos</h3>
            <p class="text-gray-500 mb-4">Agrega productos a tu compra</p>
            <button 
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              @click="addRow"
            >
              ➕ Agregar Primer Producto
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 justify-end">
        <button 
          class="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          @click="submit"
        >
          💾 Guardar Compra
        </button>
        <button 
          class="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!createdId" 
          @click="receive"
        >
          ✅ Recibir Compra
        </button>
      </div>

      <!-- Purchase Info Card (when created) -->
      <div 
        v-if="createdId"
        class="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl shadow-xl border-2 border-green-300 p-6"
      >
        <div class="flex items-center gap-3 mb-3">
          <span class="text-4xl">✅</span>
          <h3 class="text-2xl font-bold text-gray-900">Compra Creada</h3>
        </div>
        <div class="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <span class="font-semibold">ID de Compra:</span> #{{ createdId }}
          </div>
          <div>
            <span class="font-semibold">Factura:</span> {{ invoiceNumber }}
          </div>
          <div>
            <span class="font-semibold">Fecha:</span> {{ purchaseDate }}
          </div>
          <div>
            <span class="font-semibold">Proveedor:</span> #{{ supplierId }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>