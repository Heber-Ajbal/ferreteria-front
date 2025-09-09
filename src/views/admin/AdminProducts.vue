<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Administración de Productos</h1>
        <p class="text-gray-600">Crea, edita o elimina productos (solo admin)</p>
      </div>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="save" class="bg-white rounded-xl shadow p-6 mb-10 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="text-sm text-gray-600">Nombre</label>
          <input v-model="draft.name" type="text" class="w-full border rounded-lg px-3 py-2" required/>
        </div>
        <div>
          <label class="text-sm text-gray-600">Precio</label>
          <input v-model.number="draft.price" type="number" min="0" step="0.01" class="w-full border rounded-lg px-3 py-2" required/>
        </div>
        <div>
          <label class="text-sm text-gray-600">Emoji</label>
          <input v-model="draft.emoji" type="text" class="w-full border rounded-lg px-3 py-2" placeholder="🔧"/>
        </div>
        <div>
          <label class="text-sm text-gray-600">Descripción</label>
          <input v-model="draft.description" type="text" class="w-full border rounded-lg px-3 py-2"/>
        </div>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 text-white">
          {{ editingId ? 'Actualizar' : 'Agregar' }}
        </button>
        <button v-if="editingId" type="button" @click="cancel" class="px-4 py-2 rounded-lg border">Cancelar</button>
      </div>
    </form>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="p in products" :key="p.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ p.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ p.emoji }} {{ p.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">Q {{ p.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <button @click="edit(p)" class="px-3 py-1 rounded-md border">Editar</button>
              <button @click="remove(p.id)" class="px-3 py-1 rounded-md bg-red-600 text-white">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProductsStore } from "@/stores/products";

const productsStore = useProductsStore();
const { products } = storeToRefs(productsStore);

const draft = reactive<any>({ name: "", price: 0, emoji: "", description: "" });
let editingId: number | null = null;

onMounted(() => productsStore.init());

function save() {
  if (editingId) {
    productsStore.update(editingId, { ...draft });
  } else {
    productsStore.add({ ...draft });
  }
  cancel();
}

function edit(p: any) {
  editingId = p.id;
  draft.name = p.name;
  draft.price = p.price;
  draft.emoji = p.emoji;
  draft.description = p.description;
}

function cancel() {
  editingId = null;
  draft.name = "";
  draft.price = 0;
  draft.emoji = "";
  draft.description = "";
}

function remove(id: number) {
  productsStore.remove(id);
}
</script>
