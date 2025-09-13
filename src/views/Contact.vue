<script setup lang="ts">
import { reactive, ref } from "vue";
import { sendContactEmail, type ContactPayload } from "../services/contact";

const form = reactive<ContactPayload>({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const sending = ref(false);
const ok = ref(false);
const error = ref("");

async function submitForm() {
  ok.value = false; error.value = ""; sending.value = true;
  try {
    await sendContactEmail(form);
    ok.value = true;
    form.name = ""; form.email = ""; form.phone = ""; form.subject = ""; form.message = "";
  } catch (e:any) {
    error.value = e?.message || "No se pudo enviar el mensaje";
  } finally {
    sending.value = false;
  }
}

// Fallback: abrir cliente de correo (por si quieres un botón alterno)
function mailtoFallback() {
  const to = "ventas@mi-ferreteria.com";
  const subject = encodeURIComponent(form.subject || "Consulta");
  const body = encodeURIComponent(
    `Nombre: ${form.name}\nEmail: ${form.email}\nTel: ${form.phone}\n\n${form.message}`
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div class="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Contáctanos</h1>
            <p class="text-gray-600 mb-6">Escríbenos y te responderemos pronto.</p>
            <ul class="space-y-3 text-gray-700">
              <li>📍 Ciudad de Guatemala</li>
              <li>📞 +502 4677-1691</li>
              <li>✉️ ventas@mi-ferreteria.com</li>
              <li>🕘 Lun–Sáb: 8:00–18:00</li>
            </ul>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Nombre</label>
                <input v-model.trim="form.name" required
                       class="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500"
                       placeholder="Tu nombre" />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Correo</label>
                <input v-model.trim="form.email" type="email" required
                       class="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500"
                       placeholder="tu@correo.com" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Teléfono (opcional)</label>
                <input v-model.trim="form.phone"
                       class="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500"
                       placeholder="+502 ..." />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Asunto</label>
                <input v-model.trim="form.subject" required maxlength="120"
                       class="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500"
                       placeholder="¿Sobre qué trata?" />
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Mensaje</label>
              <textarea v-model="form.message" required maxlength="2000" rows="5"
                        class="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 resize-y"
                        placeholder="Cuéntanos tu consulta con detalle..."></textarea>
              <div class="text-right text-xs text-gray-500">{{ form.message.length }}/2000</div>
            </div>

            <div class="flex items-center justify-between gap-4 pt-1">
              <div class="space-x-3">
                <button type="button" class="text-sm underline" @click="mailtoFallback">
                  Probar con mailto
                </button>
                <span v-if="ok" class="text-green-600 text-sm">¡Mensaje enviado!</span>
                <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
              </div>

              <button type="submit" :disabled="sending"
                      class="ml-auto px-6 py-3 rounded-xl text-white font-semibold shadow-lg
                             bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                             disabled:opacity-50 !text-white">
                {{ sending ? "Enviando…" : "Enviar mensaje" }}
              </button>
            </div>
          </form>
        </div>

        <div class="bg-slate-50 px-8 py-6 text-sm text-slate-600">
          También puedes escribirnos por WhatsApp:
          <a class="text-blue-700 underline"
             href="https://wa.me/50246771691?text=Hola%20quiero%20m%C3%A1s%20informaci%C3%B3n"
             target="_blank" rel="noopener">+502 4677-1691</a>
        </div>
      </div>
    </div>
  </div>
</template>
