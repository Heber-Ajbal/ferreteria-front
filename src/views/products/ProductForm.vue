<script setup lang="ts">
import { reactive, onMounted, computed, ref, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
  getBrands,
  getUnits,
  type ProductPayload,
  uploadProductImage,       // 👈 nuevo
  clearProductImage,        // 👈 nuevo
} from "../../services/products";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const submitting = ref(false);
const error = ref("");

// catálogos
const categories = ref<Array<{id:number; name:string}>>([]);
const brands = ref<Array<{id:number; name:string}>>([]);
const units = ref<Array<{id:number; code:string; name:string}>>([]);

// formulario (DTO)
const form = reactive<ProductPayload>({
  sku: "",
  name: "",
  categoryId: undefined,
  brandId: undefined,
  unitId: undefined as unknown as number,
  barcode: "",
  description: "",
  costPrice: 0,
  salePrice: 0,
  isTaxable: true,
  minStock: 0
});

// ===== Imagen =====
const currentImageUrl = ref<string | null>(null); // url actual del producto (si edita)
const file = ref<File | null>(null);              // archivo nuevo
const previewUrl = ref<string | null>(null);
const imageError = ref("");
const MAX_MB = 2;

function onFileChange(e: Event) {
  imageError.value = "";
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  if (!f) return;

  if (!f.type.startsWith("image/")) {
    imageError.value = "El archivo debe ser una imagen.";
    return;
  }
  if (f.size > MAX_MB * 1024 * 1024) {
    imageError.value = `Tamaño máximo ${MAX_MB} MB.`;
    return;
  }

  // set y preview
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  file.value = f;
  previewUrl.value = URL.createObjectURL(f);
}

function clearNewFile() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  file.value = null;
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

function resetForm() {
  if (!isEdit.value) {
    form.sku = "";
    form.name = "";
    form.categoryId = undefined;
    form.brandId = undefined;
    form.unitId = undefined as unknown as number;
    form.barcode = "";
    form.description = "";
    form.costPrice = 0;
    form.salePrice = 0;
    form.isTaxable = true;
    form.minStock = 0;
    clearNewFile();
    currentImageUrl.value = null;
  }
}

async function loadLookups() {
  try { categories.value = await getCategories(); } catch { categories.value = []; }
  try { brands.value = await getBrands(); } catch { brands.value = []; }
  try { units.value = await getUnits(); } catch { units.value = []; }
}

async function loadIfEdit() {
  if (!isEdit.value) return;
  try {
    const id = Number(route.params.id);
    const p = await getProduct(id);
    // mapear a payload
    form.sku = p.sku || "";
    form.name = p.name || "";
    form.categoryId = p.category_id || undefined;
    form.brandId = p.brand_id || undefined;
    form.unitId = p.unit_id;
    form.barcode = p.barcode || "";
    form.description = p.description || "";
    form.costPrice = Number(p.cost_price || 0);
    form.salePrice = Number(p.sale_price || 0);
    form.isTaxable = !!p.is_taxable;
    form.minStock = Number(p.min_stock || 0);

    currentImageUrl.value = p.image_url ?? null; // 👈 importante
  } catch (e:any) {
    error.value = e?.response?.data?.message || "No se pudo cargar el producto";
  }
}

onMounted(async () => {
  await loadLookups();
  await loadIfEdit();
});

async function submitForm() {
  error.value = "";
  imageError.value = "";
  submitting.value = true;
  try {
    const payload: ProductPayload = {
      sku: form.sku,
      name: form.name,
      categoryId: form.categoryId,
      brandId: form.brandId,
      unitId: form.unitId,
      barcode: form.barcode || undefined,
      description: form.description || undefined,
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      isTaxable: !!form.isTaxable,
      minStock: Number(form.minStock)
    };

    if (isEdit.value) {
      const id = Number(route.params.id);
      await updateProduct(id, payload);

      // si seleccionó imagen nueva, súbela
      if (file.value) {
        const url = await uploadProductImage(id, file.value);
        currentImageUrl.value = url;
        clearNewFile();
      }
    } else {
      // crear y luego subir imagen
      const created = await createProduct(payload);
      const id = created?.product_id ?? created?.id;
      if (!id) throw new Error("No se recibió el ID del producto creado");

      if (file.value) {
        const url = await uploadProductImage(id, file.value);
        currentImageUrl.value = url;
        clearNewFile();
      }
    }

    router.push("/products/admin");
  } catch (e:any) {
    error.value = e?.response?.data?.message || e?.message || "No se pudo guardar el producto";
  } finally {
    submitting.value = false;
  }
}

async function removeCurrentImage() {
  try {
    if (!isEdit.value) {
      // si está creando y aún no existe en backend, solo limpia selección/preview
      clearNewFile();
      currentImageUrl.value = null;
      return;
    }
    const id = Number(route.params.id);
    await clearProductImage(id);
    currentImageUrl.value = null;
  } catch (e:any) {
    error.value = e?.response?.data?.message || "No se pudo quitar la imagen";
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg mb-8 p-6 border border-slate-200">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
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

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <form @submit.prevent="submitForm" class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Columna izquierda -->
          <div class="space-y-6">
            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">SKU</label>
              <input v-model.trim="form.sku" type="text" maxlength="40" required
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="SKU…" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Nombre</label>
              <input v-model.trim="form.name" type="text" required
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="Nombre del producto" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Categoría</label>
              <select v-model.number="form.categoryId"
                      class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500">
                <option :value="undefined">— Sin categoría —</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Marca</label>
              <select v-model.number="form.brandId"
                      class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500">
                <option :value="undefined">— Sin marca —</option>
                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Unidad</label>
              <select v-model.number="form.unitId" required
                      class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500">
                <option v-for="u in units" :key="u.id" :value="u.id">{{ u.code }} — {{ u.name }}</option>
              </select>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="space-y-6">
            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Código de barras</label>
              <input v-model.trim="form.barcode" type="text" maxlength="60"
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="Opcional" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Precio costo (Q)</label>
              <input v-model.number="form.costPrice" type="number" min="0" step="0.01" required
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="0.00" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Precio venta (Q)</label>
              <input v-model.number="form.salePrice" type="number" min="0" step="0.01" required
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="0.00" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Mínimo en stock</label>
              <input v-model.number="form.minStock" type="number" min="0" step="1" required
                     class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500" placeholder="0" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Afecto a IVA</label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.isTaxable" class="w-4 h-4 text-blue-600 rounded border-gray-300">
                <span class="text-gray-700">Sí</span>
              </label>
            </div>

            <!-- ===== Imagen del producto ===== -->
            <div class="group">
              <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Imagen del producto</label>
              <input type="file" accept="image/*" @change="onFileChange"
                     class="block w-full text-sm file:mr-4 file:rounded-xl file:border file:px-4 file:py-2" />
              <p v-if="imageError" class="text-sm text-red-600 mt-1">{{ imageError }}</p>

              <!-- preview de nueva selección -->
              <div v-if="previewUrl" class="mt-3 flex items-center gap-3">
                <img :src="previewUrl" class="h-28 w-28 object-cover rounded-xl border" />
                <button type="button" class="text-sm underline" @click="clearNewFile">Quitar nueva</button>
              </div>

              <!-- imagen actual si no hay nueva -->
              <div v-else-if="currentImageUrl" class="mt-3 flex items-center gap-3">
                <img :src="currentImageUrl" class="h-28 w-28 object-cover rounded-xl border" />
                <button type="button" class="text-sm text-red-600 underline" @click="removeCurrentImage">
                  Quitar imagen actual
                </button>
              </div>
            </div>
          </div>

          <!-- Descripción (full width) -->
          <div class="lg:col-span-2">
            <label class="flex items-center gap-2 text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea v-model="form.description" rows="4" maxlength="500" required
                      class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 resize-none"
                      placeholder="Describe las características del producto…"></textarea>
            <div class="text-right text-sm text-gray-500 mt-1">{{ form.description?.length || 0 }}/500</div>
          </div>

          <!-- Acciones -->
          <div class="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-6 border-t border-gray-200">
            <router-link to="/products/admin" class="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              ⬅️ Volver a la lista
            </router-link>

            <div class="flex gap-3">
              <button type="button" @click="resetForm"
                      class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                Limpiar
              </button>
              <button type="submit" :disabled="submitting"
                      class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg">
                <span v-if="!submitting">💾 {{ isEdit ? 'Actualizar' : 'Crear' }} Producto</span>
                <span v-else class="animate-pulse">Guardando…</span>
              </button>
            </div>
          </div>

        </form>

        <div v-if="error" class="px-8 pb-8 text-red-600">{{ error }}</div>
      </div>
    </div>
  </div>
</template>
