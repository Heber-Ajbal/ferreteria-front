<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <div class="mb-8">
          <div class="text-6xl mb-4 animate-bounce">🛠️</div>
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span class="text-blue-600">Mi Ferretería</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra las mejores herramientas y productos de construcción al mejor precio. 
            Calidad garantizada para todos tus proyectos.
          </p>
          <RouterLink
            to="/products"
            class="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Ver productos
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-semibold mb-3">Envío Rápido</h3>
            <p class="text-gray-600">Recibe tus productos en 24-48 horas en toda Guatemala</p>
          </div>
          <div class="text-center p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">🏆</div>
            <h3 class="text-xl font-semibold mb-3">Calidad Premium</h3>
            <p class="text-gray-600">Solo trabajamos con las mejores marcas del mercado</p>
          </div>
          <div class="text-center p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-semibold mb-3">Mejores Precios</h3>
            <p class="text-gray-600">Precios competitivos y ofertas exclusivas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Preview Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p class="text-gray-600">Algunos de nuestros productos más populares</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
              <div class="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                {{ product.emoji }}
              </div>
              <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
              
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-blue-600">Q{{ product.price }}</span>
                <button
                  @click="goToProducts"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl font-bold text-white mb-4">
          ¿Listo para comenzar tu proyecto?
        </h2>
        <p class="text-blue-100 mb-8 text-lg">
          Tenemos todo lo que necesitas para hacer realidad tus ideas
        </p>
        <RouterLink
          to="/products"
          class="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
        >
          Explorar productos
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const featuredProducts = [
  {
    id: 1,
    name: "Martillo Profesional",
    description: "Martillo de carpintero con mango ergonómico",
    price: 150,
    emoji: "🔨"
  },
  {
    id: 2,
    name: "Taladro Inalámbrico",
    description: "Taladro de 18V con batería de larga duración",
    price: 800,
    emoji: "🔧"
  },
  {
    id: 3,
    name: "Set de Herramientas",
    description: "Kit completo con 50 herramientas esenciales",
    price: 350,
    emoji: "🧰"
  }
];

const goToProducts = () => {
  router.push('/products');
};
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-30px,0);
  }
  70% {
    transform: translate3d(0,-15px,0);
  }
  90% {
    transform: translate3d(0,-4px,0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>