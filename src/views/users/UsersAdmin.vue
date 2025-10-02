<!-- src/views/users/UsersAdmin.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { listUsers, deleteUser, listRoles, type UserDto } from "../../services/users";
import UserModal from "../../components/UserModal.vue";

const loading = ref(false);
const error = ref("");
const users = ref<UserDto[]>([]);
const q = ref("");
const roleFilter = ref<string>(""); // "" = todos
const statusFilter = ref<"all" | "active" | "inactive">("all");

const showModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selected: any = ref<UserDto | null>(null);
const rolesCatalog = ref<string[]>([]);

function initials(name?: string) {
  if (!name) return "U";
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";
}

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  return users.value.filter((u) => {
    const inText =
      !term ||
      (u.full_name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.roles || []).some((r) => r.toLowerCase().includes(term));
    const inRole = !roleFilter.value || (u.roles || []).includes(roleFilter.value);
    const inStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "active" && u.is_active) ||
      (statusFilter.value === "inactive" && !u.is_active);
    return inText && inRole && inStatus;
  });
});

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const [u, roles] = await Promise.all([listUsers(), listRoles()]);
    users.value = u;
    rolesCatalog.value = roles;
  } catch (e: any) {
    error.value = e?.response?.data?.message || "No se pudo cargar usuarios";
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  modalMode.value = "create";
  selected.value = null;
  showModal.value = true;
}
function openEdit(u: UserDto) {
  modalMode.value = "edit";
  selected.value = u;
  showModal.value = true;
}
async function onSaved(_user: UserDto) {
  showModal.value = false;
  await load();
}
async function onDelete(u: UserDto) {
  if (!confirm(`¿Eliminar al usuario ${u.full_name}?`)) return;
  try {
    await deleteUser(u.user_id);
    await load();
  } catch (e: any) {
    alert(e?.response?.data?.message || "No se pudo eliminar");
  }
}

onMounted(load);
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 2xl:px-0 py-8">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">Usuarios</h1>
        <div class="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
      </div>
      <span class="text-sm text-slate-500">({{ filtered.length }} resultados)</span>

      <button
        class="!text-white ml-auto inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:from-indigo-700 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:translate-y-[1px]"
        @click="openCreate"
      >
        <span class="text-base leading-none !text-white">＋</span>
        Nuevo usuario
      </button>
    </div>

    <!-- Card contenedor con borde degradado -->
    <div class="rounded-2xl p-[1px] bg-gradient-to-br from-indigo-400/30 via-sky-400/30 to-emerald-400/30 shadow-[0_12px_40px_rgba(2,6,23,0.08)]">
      <div class="rounded-2xl bg-white ring-1 ring-white/60">

        <!-- Toolbar -->
        <div class="p-4 sm:p-5 border-b border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="q"
              type="search"
              placeholder="Buscar por nombre, email o rol…"
              class="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>
          <!-- Rol -->
          <div>
            <select
              v-model="roleFilter"
              class="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            >
              <option value="">Todos los roles</option>
              <option v-for="r in rolesCatalog" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <!-- Estado -->
          <div class="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 w-full sm:w-auto">
            <button
              class="px-3 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto"
              :class="statusFilter==='all' ? 'bg-white shadow border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'"
              @click="statusFilter='all'">Todos</button>
            <button
              class="px-3 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto"
              :class="statusFilter==='active' ? 'bg-white shadow border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'"
              @click="statusFilter='active'">Activos</button>
            <button
              class="px-3 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto"
              :class="statusFilter==='inactive' ? 'bg-white shadow border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'"
              @click="statusFilter='inactive'">Inactivos</button>
          </div>
        </div>

        <!-- Estados / Contenido -->
        <div v-if="loading" class="p-5">
          <div class="animate-pulse space-y-3">
            <div class="h-6 bg-slate-200 rounded"></div>
            <div class="h-6 bg-slate-200 rounded w-5/6"></div>
            <div class="h-6 bg-slate-200 rounded w-2/3"></div>
            <div class="h-6 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
        <div v-else-if="error" class="py-14 text-center text-rose-600">{{ error }}</div>
        <div v-else>
          <!-- Mobile: cards -->
          <div class="sm:hidden p-4 sm:p-5 space-y-3">
            <div v-for="u in filtered" :key="u.user_id" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center font-semibold">
                  {{ initials(u.full_name) }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ u.full_name }}</p>
                  <p class="truncate text-xs text-slate-600">{{ u.email }}</p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span v-for="r in (u.roles || [])" :key="r" class="rounded-md bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 border border-blue-100">
                      {{ r }}
                    </span>
                  </div>
                  <span
                    class="mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] border"
                    :class="u.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'">
                    {{ u.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button class="px-3 py-2 rounded-lg border text-sm hover:bg-slate-50" @click="openEdit(u)">Editar</button>
                <button class="px-3 py-2 rounded-lg border text-sm text-rose-700 hover:bg-rose-50 border-rose-200" @click="onDelete(u)">Eliminar</button>
              </div>
            </div>
            <div v-if="!filtered.length" class="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 text-sm">
              Sin resultados
            </div>
          </div>

          <!-- Desktop: tabla -->
          <div class="hidden sm:block">
            <div class="overflow-x-auto">
              <table class="min-w-[900px] w-full">
                <thead class="bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 sticky top-0 z-10">
                  <tr class="divide-x divide-slate-200/60">
                    <th class="px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase text-slate-600">ID</th>
                    <th class="px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase text-slate-600">Nombre</th>
                    <th class="px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase text-slate-600">Email</th>
                    <th class="px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase text-slate-600">Roles</th>
                    <th class="px-4 py-3 text-left text-[11px] font-semibold tracking-wide uppercase text-slate-600">Estado</th>
                    <th class="px-4 py-3">Accion</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(u, i) in filtered" :key="u.user_id" :class="i % 2 === 1 ? 'bg-slate-50/30' : ''" class="hover:bg-slate-50">
                    <td class="px-4 py-3 text-sm text-slate-600">#{{ u.user_id }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center text-xs font-semibold">
                          {{ initials(u.full_name) }}
                        </div>
                        <div class="min-w-0">
                          <p class="truncate text-sm font-medium text-slate-900">{{ u.full_name }}</p>
                          <p class="truncate text-xs text-slate-500">{{ u.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ u.email }}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        <span v-for="r in (u.roles || [])" :key="r" class="rounded-md bg-blue-50 text-blue-700 text-xs px-2 py-0.5 border border-blue-100">
                          {{ r }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center rounded-md px-2 py-0.5 text-xs border"
                        :class="u.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'">
                        {{ u.is_active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="inline-flex gap-2">
                        <button class="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50" @click="openEdit(u)">Editar</button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!filtered.length">
                    <td colspan="6" class="px-4 py-12 text-center">
                      <div class="flex flex-col items-center gap-2">
                        <div class="h-12 w-12 rounded-2xl bg-slate-100 grid place-items-center">👤</div>
                        <p class="text-slate-600 text-sm">No encontramos usuarios con esos filtros.</p>
                        <button
                          class="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:from-indigo-700 hover:to-blue-700"
                          @click="openCreate"
                        >Crear usuario</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <!-- /contenido -->
      </div>
    </div>

    <!-- Modal -->
    <UserModal
      v-model="showModal"
      :mode="modalMode"
      :user="selected"
      :roles-catalog="rolesCatalog"
      @saved="onSaved"
    />
  </div>
</template>
