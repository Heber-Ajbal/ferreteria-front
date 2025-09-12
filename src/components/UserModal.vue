<!-- src/components/UserModal.vue -->
<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import type { CreateUserInput, UpdateUserInput, UserDto } from "../services/users";
import { createUser, updateUser } from "../services/users";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "edit";
  user?: UserDto | null;
  rolesCatalog: string[];
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
  touched: {
    fullName: false,
    email: false,
    password: false,
  } as Record<string, boolean>,
});

watch(
  () => props.user,
  (u) => {
    if (props.mode === "edit" && u) {
      state.fullName = u.full_name ?? "";
      state.email = u.email ?? "";
      state.password = "";
      state.isActive = !!u.is_active;
      state.roles = new Set(u.roles || []);
      state.error = "";
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

const emailValid = computed(() => /^\S+@\S+\.\S+$/.test(state.email.trim()));
const passwordOk = computed(() =>
  props.mode === "edit" ? state.password.trim().length === 0 || state.password.trim().length >= 6
                        : state.password.trim().length >= 6
);

const canSave = computed(() => {
  if (!state.fullName.trim()) return false;
  if (!emailValid.value) return false;
  if (!passwordOk.value) return false;
  return true;
});

function close() {
  open.value = false;
}

function reset() {
  state.fullName = "";
  state.email = "";
  state.password = "";
  state.isActive = true;
  state.roles = new Set<string>();
  state.loading = false;
  state.error = "";
  state.touched = { fullName: false, email: false, password: false };
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
    <transition name="fade-zoom">
      <div
        v-if="open"
        class="fixed inset-0 z-[999]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="close"></div>

        <!-- Modal Wrapper -->
        <div class="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6">
          <div class="w-full sm:max-w-xl md:max-w-2xl">
            <!-- Gradient border frame -->
            <div class="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-400/40 via-sky-400/40 to-emerald-400/40 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
              <div class="rounded-2xl bg-white ring-1 ring-white/60">
                <!-- Header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200/70">
                  <div class="flex items-center gap-3">
                    <span class="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white grid place-items-center shadow">
                      👤
                    </span>
                    <h3 id="user-modal-title" class="text-lg font-semibold text-slate-900">
                      {{ mode === 'create' ? 'Nuevo usuario' : 'Editar usuario' }}
                    </h3>
                  </div>
                  <button class="p-2 rounded-lg hover:bg-slate-100 transition" @click="close" aria-label="Cerrar">
                    ✕
                  </button>
                </div>

                <!-- Body -->
                <form class="p-5 grid gap-6 md:grid-cols-2" @submit.prevent="save">
                  <div class="space-y-4">
                    <!-- Nombre -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1" for="fullName">Nombre completo</label>
                      <input
                        id="fullName"
                        v-model="state.fullName"
                        @blur="state.touched.fullName = true"
                        type="text"
                        autocomplete="name"
                        class="w-full h-11 rounded-xl border bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                        :class="state.touched.fullName && !state.fullName.trim() ? 'border-rose-400' : 'border-slate-300'"
                        placeholder="Ej. Ana López"
                      />
                      <p v-if="state.touched.fullName && !state.fullName.trim()" class="mt-1 text-xs text-rose-600">
                        Ingresa el nombre completo.
                      </p>
                    </div>

                    <!-- Email -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1" for="email">Email</label>
                      <input
                        id="email"
                        v-model="state.email"
                        @blur="state.touched.email = true"
                        type="email"
                        autocomplete="email"
                        class="w-full h-11 rounded-xl border bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                        :class="state.touched.email && !emailValid ? 'border-rose-400' : 'border-slate-300'"
                        placeholder="mail@ejemplo.com"
                      />
                      <p v-if="state.touched.email && !emailValid" class="mt-1 text-xs text-rose-600">
                        Ingresa un email válido.
                      </p>
                    </div>

                    <!-- Contraseña -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1" for="password">
                        Contraseña
                        <span v-if="mode==='edit'" class="text-slate-500 text-xs">(opcional)</span>
                      </label>
                      <input
                        id="password"
                        v-model="state.password"
                        @blur="state.touched.password = true"
                        type="password"
                        autocomplete="new-password"
                        minlength="6"
                        class="w-full h-11 rounded-xl border bg-white px-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                        :class="state.touched.password && !passwordOk ? 'border-rose-400' : 'border-slate-300'"
                        :placeholder="mode === 'edit' ? 'Deja vacío para no cambiar' : 'Mínimo 6 caracteres'"
                      />
                      <p v-if="state.touched.password && !passwordOk" class="mt-1 text-xs text-rose-600">
                        La contraseña debe tener al menos 6 caracteres.
                      </p>
                    </div>

                    <!-- Activo -->
                    <div class="flex items-center gap-2 pt-1">
                      <input
                        id="isActive"
                        v-model="state.isActive"
                        type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label for="isActive" class="text-sm text-slate-700">Activo</label>
                    </div>
                  </div>

                  <!-- Roles -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Roles</label>
                    <div class="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      <button
                        v-for="r in rolesCatalog"
                        :key="r"
                        type="button"
                        @click="toggleRole(r)"
                        class="group flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition"
                        :class="state.roles.has(r)
                          ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100'
                          : 'border-slate-300 hover:bg-slate-50'"
                        aria-pressed="state.roles.has(r)"
                      >
                        <span class="text-slate-800">{{ r }}</span>
                        <span
                          class="inline-flex h-6 w-10 items-center rounded-full transition"
                          :class="state.roles.has(r) ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'"
                        >
                          <span class="h-5 w-5 m-0.5 rounded-full bg-white shadow"></span>
                        </span>
                      </button>
                    </div>

                    <div v-if="state.error" class="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                      {{ state.error }}
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="md:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      class="h-11 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition"
                      @click="close"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      :disabled="state.loading || !canSave"
                      class="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:from-indigo-700 hover:to-blue-700 active:scale-[.99] transition disabled:cursor-not-allowed disabled:brightness-95 disabled:saturate-75"
                    >
                      <span v-if="!state.loading">{{ mode === 'create' ? 'Crear' : 'Guardar cambios' }}</span>
                      <span v-else class="inline-flex items-center gap-2 text-white">
                        <span class="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Guardando…
                      </span>
                    </button>
                  </div>
                </form>
                <!-- /Body -->
              </div>
            </div>
          </div>
        </div>
        <!-- /Wrapper -->
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-zoom-enter-active, .fade-zoom-leave-active { transition: opacity .2s ease, transform .2s ease; }
.fade-zoom-enter-from, .fade-zoom-leave-to { opacity: 0; transform: translateY(8px) scale(.98); }
</style>
