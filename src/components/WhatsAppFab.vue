<script setup lang="ts">
import { computed } from "vue";

// Toma el número y el texto desde .env (puedes hardcodear si prefieres)
const phone = import.meta.env.VITE_WHATSAPP_PHONE ?? "50246771691";
const message = import.meta.env.VITE_WHATSAPP_TEXT ?? "Hola quiero más información sobre la ferretería";

const href = computed(() =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
);
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener"
    aria-label="Chatear por WhatsApp"
    class="fixed z-50 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-white" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.16 1.61 5.97L0 24l6.24-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.48-8.52zM12 22c-1.77 0-3.48-.46-4.98-1.34l-.36-.21-3.7.97.99-3.61-.23-.37A9.92 9.92 0 0 1 2 12C2 6.49 6.49 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.9 9.9 0 0 1 22 12c0 5.51-4.49 10-10 10zm5.2-7.59c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.73.93-.89 1.12-.16.19-.33.21-.62.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36s-1 1-1 2.45c0 1.45 1.02 2.85 1.16 3.05.14.19 2 3.05 4.85 4.28.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"
      />
    </svg>
  </a>
</template>
