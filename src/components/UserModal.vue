<!-- src/components/UserModal.vue -->
<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import type { CreateUserInput, UpdateUserInput, UserDto } from "../services/users";
import { createUser, updateUser } from "../services/users";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "edit";
  user?: UserDto | null;
  rolesCatalog: string[]; // lista de roles disponibles
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "saved", user: UserDto): void;
}>();

const state = reactive({
  fullName: "",
  email: "",
  password: "",
  isActive: true,
  roles: new Set<string>(),
  loading: false,
  error: "",
});

watch(
  () => props.user,
  (u) => {
    if (props.mode === "edit" && u) {
      state.fullName = u.full_name ?? "";
      state.email = u.email ?? "";
      state.password = ""; // no mostrar hash, se envía solo si lo cambian
      state.isActive = !!u.is_active;
      state.roles = new Set(u.roles || []);
    } else if (props.mode === "create") {
      reset();
    }
  },
  { immediate: true }
);

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

function toggleRole(r: string) {
  if (state.roles.has(r)) state.roles.delete(r);
  else state.roles.add(r);
}

const canSave = computed(() => {
  if (!state.fullName.trim()) return false;
  if (!/^\S+@\S+\.\S+$/.test(state.email.trim())) return false;
  if (props.mode === "create" && state.password.trim().length < 6) return false;
  // en edit, password es opcional
  return true;
});

function close() {
  open.value = false;
}

function reset() {
  Object.assign(state, {
    fullName: "",
    email: "",
    password: "",
    isActive: true,
    roles: new Set<string>(),
    loading: false,
    error: "",
  });
}

async function save() {
  if (!canSave.value) return;
  state.loading = true;
  state.error = "";

  try {
    if (props.mode === "create") {
      const payload: CreateUserInput = {
        fullName: state.fullName.trim(),
        email: state.email.trim(),
        password: state.password.trim(),
        isActive: state.isActive,
        roles: Array.from(state.roles),
      };
      const u = await createUser(payload);
      emit("saved", u);
      reset();
      close();
    } else if (props.mode === "edit" && props.user) {
      const payload: UpdateUserInput = {
        fullName: state.fullName.trim(),
        email: state.email.trim(),
        isActive: state.isActive,
        roles: Array.from(state.roles),
      };
      if (state.password.trim()) payload.password = state.password.trim();
      const u = await updateUser(props.user.user_id, payload);
      emit("saved", u);
      close();
    }
  } catch (e: any) {
    state.error = e?.response?.data?.message || "No se pudo guardar el usuario";
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[999]">
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-xl border">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ mode === 'create' ? 'Nuevo usuario' : 'Editar usuario' }}
            </h3>
            <button class="rounded p-1 hover:bg-gray-100" @click="close">✕</button>
          </div>

          <!-- Body -->
          <div class="p-5 grid gap-5 md:grid-cols-2">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input v-model="state.fullName" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="state.email" type="email" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span v-if="mode==='edit'" class="text-gray-500 text-xs">(dejar en blanco para no cambiar)</span>
                </label>
                <input v-model="state.password" type="password" minlength="6" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="flex items-center gap-2">
                <input id="isActive" v-model="state.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label for="isActive" class="text-sm text-gray-700">Activo</label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Roles</label>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="r in rolesCatalog"
                  :key="r"
                  class="flex items-center justify-between rounded-lg border px-3 py-2"
                  :class="state.roles.has(r) ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'"
                >
                  <span class="text-sm text-gray-700">{{ r }}</span>
                  <input type="checkbox" :checked="state.roles.has(r)" @change="toggleRole(r)" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </label>
              </div>

              <div v-if="state.error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {{ state.error }}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-5 border-t flex justify-end gap-2">
            <button class="px-4 py-2 rounded-lg border hover:bg-gray-50" @click="close">Cancelar</button>
            <button
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              :disabled="state.loading || !canSave"
              @click="save"
            >
              <span v-if="!state.loading">{{ mode === 'create' ? 'Crear' : 'Guardar cambios' }}</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
                </svg>
                Guardando…
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
