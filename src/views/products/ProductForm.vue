<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-lg mb-8 p-6 border border-slate-200">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">
              {{ isEdit ? "Editar Producto" : "Nuevo Producto" }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ isEdit ? "Modifica los detalles del producto" : "Completa la información del nuevo producto" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <form @submit.prevent="submitForm" class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Nombre -->
              <div class="group">
                <label class="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  Nombre del Producto
                </label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-gray-300" 
                  placeholder="Ingresa el nombre del producto"
                  required 
                />
              </div>

              <!-- Precio -->
              <div class="group">
                <label class="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  Precio (Q)
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Q</span>
                  <input 
                    v-model.number="form.price" 
                    type="number" 
                    min="0" 
                    step="0.01"
                    class="w-full border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-gray-300" 
                    placeholder="0.00"
                    required 
                  />
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- URL de Imagen -->
              <div class="group">
                <label class="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  URL de Imagen
                </label>
                <input 
                  v-model="form.image" 
                  type="url" 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-gray-300" 
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required 
                />
                <!-- Vista previa de imagen -->
                <div v-if="form.image" class="mt-3">
                  <img 
                    :src="form.image" 
                    alt="Vista previa" 
                    class="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    @error="imageError = true"
                    @load="imageError = false"
                  />
                  <p v-if="imageError" class="text-red-500 text-sm mt-1">No se pudo cargar la imagen</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Descripción - Full Width -->
          <div class="mt-6 group">
            <label class="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Descripción
            </label>
            <textarea 
              v-model="form.description" 
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-gray-300 resize-none" 
              rows="4"
              placeholder="Describe las características y beneficios del producto..."
              required
            ></textarea>
            <div class="text-right text-sm text-gray-500 mt-1">
              {{ form.description.length }}/500 caracteres
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <router-link 
              to="/products/admin" 
              class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
            >
              <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Volver a la lista
            </router-link>
            
            <div class="flex gap-3">
              <button 
                type="button"
                @click="resetForm"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Limpiar
              </button>
              <button 
                type="submit" 
                class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                :disabled="isSubmitting"
              >
                <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar Producto' : 'Crear Producto') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Estados reactivos
const imageError = ref(false);
const isSubmitting = ref(false);

// Para simular un backend, vamos a usar un array local
const products = reactive<any[]>([
  // Aquí podrías importar tus productos reales si quieres
]);

const isEdit = computed(() => !!route.params.id);

const form = reactive({
  name: "",
  description: "",
  price: 0,
  image: ""
});

// Si es edición, cargamos los datos del producto
onMounted(() => {
  if (isEdit.value) {
    const product = products.find(p => p.id === Number(route.params.id));
    if (product) {
      form.name = product.name;
      form.description = product.description;
      form.price = product.price;
      form.image = product.image;
    }
  }
});

function resetForm() {
  if (!isEdit.value) {
    form.name = "";
    form.description = "";
    form.price = 0;
    form.image = "";
  }
}

async function submitForm() {
  isSubmitting.value = true;
  
  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    if (isEdit.value) {
      // Editar producto
      const product = products.find(p => p.id === Number(route.params.id));
      if (product) {
        product.name = form.name;
        product.description = form.description;
        product.price = form.price;
        product.image = form.image;
      }
      alert("✅ Producto actualizado exitosamente");
    } else {
      // Crear nuevo producto
      products.push({
        id: products.length + 1,
        name: form.name,
        description: form.description,
        price: form.price,
        image: form.image
      });
      alert("✅ Producto creado exitosamente");
    }
    
    router.push("/products/admin");
  } catch (error) {
    alert("❌ Error al guardar el producto. Intenta nuevamente.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>