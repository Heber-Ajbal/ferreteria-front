<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps<{
  modelValue?: File | null;
  currentUrl?: string | null; // url actual del producto (si edita)
  maxSizeMb?: number;         // default 2MB
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: File | null): void;
  (e: 'remove-current'): void; // click en "Quitar imagen actual"
}>();

const file = ref<File | null>(props.modelValue ?? null);
const previewUrl = ref<string | null>(null);
const error = ref('');

const maxSize = (props.maxSizeMb ?? 2) * 1024 * 1024;

watch(() => props.modelValue, (v) => {
  file.value = v ?? null;
  genPreview();
});

function onPick(e: Event) {
  error.value = '';
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) {
    error.value = 'El archivo debe ser una imagen.';
    return;
  }
  if (f.size > maxSize) {
    error.value = `Máximo ${(maxSize/1024/1024).toFixed(0)}MB.`;
    return;
  }
  file.value = f;
  emit('update:modelValue', f);
  genPreview();
}

function genPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = file.value ? URL.createObjectURL(file.value) : null;
}

function clearNew() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  file.value = null;
  emit('update:modelValue', null);
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium">Imagen (opcional)</label>

    <input
      type="file"
      accept="image/*"
      @change="onPick"
      class="block w-full text-sm file:mr-4 file:rounded-xl file:border file:px-4 file:py-2"
    />

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <!-- preview nueva -->
    <div v-if="previewUrl" class="flex items-center gap-3">
      <img :src="previewUrl" class="h-28 w-28 object-cover rounded-xl border" />
      <button type="button" class="text-sm underline" @click="clearNew">Quitar nueva</button>
    </div>

    <!-- imagen actual (si no hay nueva) -->
    <div v-else-if="currentUrl" class="flex items-center gap-3">
      <img :src="currentUrl" class="h-28 w-28 object-cover rounded-xl border" />
      <button type="button" class="text-sm text-red-600 underline" @click="$emit('remove-current')">
        Quitar imagen actual
      </button>
    </div>
  </div>
</template>
