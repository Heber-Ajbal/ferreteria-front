<script setup lang="ts">
import { useCartStore } from "../stores/cart";
import { storeToRefs } from "pinia";
const cart = useCartStore();
const { count } = storeToRefs(cart);

</script>

<template>
    <header class="bg-white shadow-sm">
        <div class="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
            <!-- Logo -->
            <RouterLink to="/" class="text-2xl font-bold text-blue-600">
                🛒 Mi Ferretería
            </RouterLink>

            <!-- Navegación -->
            <nav class="flex gap-6 text-gray-700 font-medium">
                <RouterLink to="/" class="hover:text-blue-600">Inicio</RouterLink>
                <RouterLink to="/products" class="hover:text-blue-600">Productos</RouterLink>
                <RouterLink to="/auth/login" class="hover:text-blue-600">Login</RouterLink>
                
                <RouterLink to="/cart" class="relative hover:text-blue-600">
                    Carrito
                    <span v-if="count" class="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5">
                        {{ count }}
                    </span>
                </RouterLink>

            </nav>
        </div>
    </header>
</template>
