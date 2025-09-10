<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Nuestros Productos</h1>
      <p class="text-gray-600">Encuentra las mejores herramientas y accesorios para tus proyectos</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div class="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-blue-600">Q{{ product.price }}</span>
            <button
              @click="addToCart(product)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>🛒</span>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart';
const cart = useCartStore();

const products = [
  { 
    id: 1, 
    name: "Martillo Profesional", 
    price: 150, 
    description: "Martillo de carpintero con mango ergonómico", 
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 2, 
    name: "Taladro Inalámbrico", 
    price: 800, 
    description: "Taladro de 18V con batería de larga duración", 
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 3, 
    name: "Set de Destornilladores", 
    price: 75, 
    description: "Kit de destornilladores de precisión", 
    image: "https://images.unsplash.com/photo-1616628188501-1d0f495facac?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 4, 
    name: "Llave Inglesa", 
    price: 120, 
    description: "Llave ajustable de acero resistente", 
    image: "https://images.unsplash.com/photo-1599070207130-a0917aeac869?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 5, 
    name: "Caja de Herramientas", 
    price: 450, 
    description: "Maletín con herramientas esenciales para el hogar", 
    image: "https://images.unsplash.com/photo-1565792465071-9cdfbb2e2930?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 6, 
    name: "Sierra Eléctrica", 
    price: 950, 
    description: "Sierra circular para cortes precisos en madera", 
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 7, 
    name: "Cinta Métrica", 
    price: 50, 
    description: "Cinta métrica retráctil de 5 metros", 
    image: "https://images.unsplash.com/photo-1582989949959-719ac986adb0?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 8, 
    name: "Guantes de Seguridad", 
    price: 90, 
    description: "Guantes resistentes para trabajos pesados", 
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 9, 
    name: "Escalera de Aluminio", 
    price: 600, 
    description: "Escalera ligera de 6 peldaños", 
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 10, 
    name: "Pintura Blanca 1 Galón", 
    price: 250, 
    description: "Pintura de alta cobertura para interiores", 
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 11, 
    name: "Brochas de Pintura", 
    price: 45, 
    description: "Juego de 3 brochas multiusos", 
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 12, 
    name: "Alicate Universal", 
    price: 85, 
    description: "Alicate de acero inoxidable con mango antideslizante", 
    image: "https://images.unsplash.com/photo-1597631386042-b73250b1f2cd?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 13, 
    name: "Cerradura de Seguridad", 
    price: 320, 
    description: "Cerradura de acero reforzado para puertas", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 14, 
    name: "Linterna LED", 
    price: 110, 
    description: "Linterna recargable de larga duración", 
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 15, 
    name: "Clavos y Tornillos", 
    price: 30, 
    description: "Caja surtida de clavos y tornillos", 
    image: "https://images.unsplash.com/photo-1609205761050-39bca53d8ad4?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 16, 
    name: "Lentes de Seguridad", 
    price: 70, 
    description: "Protección ocular contra partículas", 
    image: "https://images.unsplash.com/photo-1593032465174-21cb963705c8?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 17, 
    name: "Disco de Corte", 
    price: 55, 
    description: "Disco de corte para metal y madera", 
    image: "https://images.unsplash.com/photo-1581093332935-ccd0b350d1d7?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 18, 
    name: "Pistola de Silicón", 
    price: 95, 
    description: "Pistola para aplicar pegamento caliente", 
    image: "https://images.unsplash.com/photo-1594298948611-3370511ce92f?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 19, 
    name: "Compresor de Aire", 
    price: 1500, 
    description: "Compresor portátil de 50 litros", 
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop&crop=center"
  },
  { 
    id: 20, 
    name: "Generador Eléctrico", 
    price: 4500, 
    description: "Generador a gasolina de 3500W", 
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=center"
  },
];

function addToCart(product: any) {
  cart.add({
    id: product.id,
    name: product.name,
    price: product.price,
    qty: 1
  });
}



</script>