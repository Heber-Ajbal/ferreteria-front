<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Sección de la empresa -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-2xl">🛠️</span>
            <span class="text-2xl font-bold">Mi Ferretería</span>
          </div>
          <p class="text-gray-400 text-sm max-w-md">
            Tu tienda de confianza para herramientas y productos de construcción en Guatemala. 
            Calidad garantizada y los mejores precios del mercado.
          </p>
        </div>
        
        <!-- Enlaces rápidos -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>
              <RouterLink to="/" class="hover:text-white transition-colors">
                Inicio
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products" class="hover:text-white transition-colors">
                Productos
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/cart" class="hover:text-white transition-colors">
                Carrito
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/auth/login" class="hover:text-white transition-colors">
                Iniciar Sesión
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <!-- Información de contacto -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contacto</h4>
          <div class="space-y-2 text-sm text-gray-400">
            <div class="flex items-center space-x-2">
              <span>📍</span>
              <span>Guatemala City, Guatemala</span>
            </div>
            <div class="flex items-center space-x-2">
              <span>📞</span>
              <span>+502 1234-5678</span>
            </div>
            <div class="flex items-center space-x-2">
              <span>✉️</span>
              <span>info@miferreteria.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Línea divisoria y copyright -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 Mi Ferretería. Todos los derechos reservados.</p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" class="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No se necesita JavaScript para este componente básico
</script>

<style scoped>
/* Estilos específicos del footer si son necesarios */
</style>