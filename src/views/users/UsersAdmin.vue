<!-- src/views/users/UsersAdmin.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { listUsers, deleteUser, listRoles, type UserDto } from "../../services/users";
import UserModal from "../../components/UserModal.vue";

const loading = ref(false);
const error = ref("");
const users = ref<UserDto[]>([]);
const q = ref("");
const showModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selected: any = ref<UserDto | null>(null);
const rolesCatalog = ref<string[]>([]);

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return users.value;
  return users.value.filter(u =>
    (u.full_name || "").toLowerCase().includes(term) ||
    (u.email || "").toLowerCase().includes(term) ||
    (u.roles || []).some(r => r.toLowerCase().includes(term))
  );
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
  await load(); // recarga la lista
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
    <div class="mb-6 flex items-center gap-3">
      <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
      <button
        class="ml-auto inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="openCreate"
      >
        + Nuevo usuario
      </button>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="q"
        type="search"
        placeholder="Buscar por nombre, email o rol…"
        class="w-full sm:w-80 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-if="loading" class="py-10 text-center text-gray-600">Cargando…</div>
    <div v-else-if="error" class="py-10 text-center text-red-600">{{ error }}</div>

    <div v-else class="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nombre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Roles</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Estado</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="u in filtered" :key="u.user_id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-600">#{{ u.user_id }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ u.full_name }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ u.email }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="r in u.roles" :key="r" class="rounded-md bg-blue-50 text-blue-700 text-xs px-2 py-0.5 border border-blue-100">
                  {{ r }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                :class="u.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'"
                class="inline-flex items-center rounded-md px-2 py-0.5 text-xs border"
              >
                {{ u.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex gap-2">
                <button class="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50" @click="openEdit(u)">Editar</button>
                <button class="px-3 py-1.5 rounded-lg border text-sm text-red-700 hover:bg-red-50 border-red-200" @click="onDelete(u)">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6" class="px-4 py-10 text-center text-gray-500 text-sm">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserModal
      v-model="showModal"
      :mode="modalMode"
      :user="selected"
      :roles-catalog="rolesCatalog"
      @saved="onSaved"
    />
  </div>
</template>
