<template>
  <div class="min-h-screen bg-white relative overflow-hidden">
    
    <!-- Hero Section -->
    <section class="hero-bg relative py-20 px-4 min-h-screen flex items-center bg-white">
      <div class="max-w-7xl mx-auto text-center relative z-10">
        <div class="mb-12">
          <!-- Iconos SVG animados de ferretería -->
          <div class="flex justify-center items-center gap-12 mb-12">
            <div class="animate-float tool-shadow">
              <svg class="w-20 h-20 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.9 12.2c0-2.2 1.6-4.1 3.7-4.4V6.3c0-.8.7-1.5 1.5-1.5h9.8c.8 0 1.5.7 1.5 1.5v1.5c2.1.3 3.7 2.2 3.7 4.4v4.4c0 1.4-1.1 2.5-2.5 2.5H4.4c-1.4 0-2.5-1.1-2.5-2.5v-4.4zm5.5 4.4h9.2c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5H7.4c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5zm0-6.2h9.2v1.5H7.4V10.4zM12 2.8c1.1 0 2 .9 2 2v1H10v-1c0-1.1.9-2 2-2z"/>
              </svg>
            </div>
            <div class="animate-float tool-shadow" style="animation-delay: 0.5s;">
              <svg class="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
              </svg>
            </div>
            <div class="animate-float tool-shadow" style="animation-delay: 1s;">
              <svg class="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 2.18l-2.25 4.56-5.02.73 3.63 3.54-.86 5.01L12 15.77l4.5 2.37-.86-5.01L19.27 9.5l-5.02-.73L12 4.18z"/>
              </svg>
            </div>
          </div>
          
          <h1 class="text-6xl md:text-8xl font-black text-black mb-8 leading-tight animate-slide-in-left">
            MI FERRETERÍA
            <span class="block text-4xl md:text-5xl mt-4 text-transparent bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text font-semibold">
              PRO
            </span>
          </h1>
          
          <!-- Imagen de herramientas como fondo -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex justify-center items-center opacity-10">
              <svg class="w-96 h-64" viewBox="0 0 400 300" fill="none">
                <!-- Martillo -->
                <path d="M50 150 L150 150 L170 130 L180 140 L160 160 L150 150 L50 150 Z" fill="#8B4513" stroke="#654321" stroke-width="2"/>
                <rect x="170" y="135" width="15" height="10" fill="#C0C0C0"/>
                
                <!-- Destornillador -->
                <line x1="220" y1="120" x2="320" y2="120" stroke="#FF6B35" stroke-width="8"/>
                <circle cx="230" cy="120" r="6" fill="#2C3E50"/>
                
                <!-- Llave inglesa -->
                <path d="M80 200 L180 200 L190 190 L200 200 L190 210 L180 200 L80 200 Z" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
                <circle cx="90" cy="200" r="8" fill="#34495E"/>
              </svg>
            </div>
          </div>
          
          <p class="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Tu destino para herramientas profesionales y productos de 
            <span class="font-bold text-orange-600">primera calidad</span>. 
            Construye el futuro con nosotros.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button @click="scrollToProducts" class="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg animate-pulse-glow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <span>Explorar Catálogo</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            
            <button @click="scrollToFeatures" class="group inline-flex items-center gap-3 bg-white text-gray-800 px-8 py-5 rounded-2xl text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Conocer Más</span>
              <svg class="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold text-sm uppercase mb-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            ¿Por qué elegirnos?
          </div>
          <h2 class="text-5xl font-black text-black mt-4 mb-6">
            Experiencia Profesional
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 20 años respaldando a profesionales y constructores en Guatemala
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-10">
          <!-- Feature 1: Envío Express -->
          <div class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="bg-gradient-orange w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-black">Envío Express</h3>
            <p class="text-gray-600 text-lg leading-relaxed">
              Entrega en 24-48 horas en toda Guatemala. Tu proyecto no puede esperar.
            </p>
          </div>
          
          <!-- Feature 2: Calidad Garantizada -->
          <div class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="bg-gradient-blue w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-black">Calidad Garantizada</h3>
            <p class="text-gray-600 text-lg leading-relaxed">
              Marcas reconocidas mundialmente. Respaldamos cada venta con garantía.
            </p>
          </div>
          
          <!-- Feature 3: Precios Imbatibles -->
          <div class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="bg-gradient-green w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-black">Precios Imbatibles</h3>
            <p class="text-gray-600 text-lg leading-relaxed">
              Los mejores precios del mercado. Calidad sin comprometer tu presupuesto.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Showcase Section -->
    <section id="products" class="py-24 bg-gradient-to-br from-gray-100 to-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm uppercase mb-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            Nuestros Destacados
          </div>
          <h2 class="text-5xl font-black text-black mt-4 mb-6">
            Productos Premium
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Herramientas y equipos de construcción que los profesionales prefieren
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Product 1: Taladro Pro -->
          <div class="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:scale-105">
            <div class="h-32 flex items-center justify-center mb-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl">
              <svg class="w-20 h-20 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.707 3.293c-.39-.39-1.024-.39-1.414 0L15 4.586V3c0-.553-.448-1-1-1s-1 .447-1 1v1.586l-1.293-1.293c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414L11.586 6H10c-.552 0-1 .447-1 1s.448 1 1 1h1.586l-1.293 1.293c-.39.39-.39 1.024 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L13 9.414V11c0 .553.448 1 1 1s1-.447 1-1V9.414l1.293 1.293c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.024 0-1.414L16.414 8H18c.552 0 1-.447 1-1s-.448-1-1-1h-1.586l1.293-1.293c.39-.39.39-1.024 0-1.414zM12 13c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold mb-3 text-black">Taladro Pro</h3>
            <p class="text-gray-600 mb-6 leading-relaxed">Potente y duradero para cualquier proyecto. Motor de alta eficiencia.</p>
            
            <div class="flex items-center justify-between">
              <div class="text-3xl font-black text-green-600">Q750</div>
              <RouterLink 
                to="/products"
                class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md"
              >
                Ver Más
              </RouterLink>
            </div>
          </div>

          <!-- Product 2: Sierra Circular -->
          <div class="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:scale-105">
            <div class="h-32 flex items-center justify-center mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <svg class="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0C9.33 11 10 10.33 10 9.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold mb-3 text-black">Sierra Circular</h3>
            <p class="text-gray-600 mb-6 leading-relaxed">Corte preciso y rápido. Ideal para carpintería profesional.</p>
            
            <div class="flex items-center justify-between">
              <div class="text-3xl font-black text-green-600">Q620</div>
              <RouterLink 
                to="/products"
                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
              >
                Ver Más
              </RouterLink>
            </div>
          </div>

          <!-- Product 3: Llave Inglesa -->
          <div class="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:scale-105">
            <div class="h-32 flex items-center justify-center mb-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
              <svg class="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold mb-3 text-black">Llave Inglesa</h3>
            <p class="text-gray-600 mb-6 leading-relaxed">Ideal para trabajos de fontanería. Material resistente.</p>
            
            <div class="flex items-center justify-between">
              <div class="text-3xl font-black text-green-600">Q320</div>
              <RouterLink 
                to="/products"
                class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
              >
                Ver Más
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-24 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-32 h-32 border-2 border-white rotate-45"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rotate-12"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 border border-white rotate-45"></div>
      </div>
      
      <div class="max-w-6xl mx-auto text-center px-4 relative z-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-8">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        
        <h2 class="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          ¿Listo Para Crear Algo 
          <span class="text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text">
            Increíble?
          </span>
        </h2>
        <p class="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          No importa si eres profesional o entusiasta del bricolaje, tenemos las herramientas 
          perfectas para hacer realidad tus proyectos más ambiciosos.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <RouterLink
            to="/products"
            class="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>Explorar Catálogo</span>
            <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </RouterLink>
          
          <a 
            href="https://wa.me/50246771691" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl transform hover:scale-105"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            <span>Contáctanos</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Logo y descripción -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.9 12.2c0-2.2 1.6-4.1 3.7-4.4V6.3c0-.8.7-1.5 1.5-1.5h9.8c.8 0 1.5.7 1.5 1.5v1.5c2.1.3 3.7 2.2 3.7 4.4v4.4c0 1.4-1.1 2.5-2.5 2.5H4.4c-1.4 0-2.5-1.1-2.5-2.5v-4.4z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold">Mi Ferretería PRO</h3>
            </div>
            <p class="text-gray-400 leading-relaxed mb-6">
              Más de 20 años siendo tu aliado en construcción y reparaciones. 
              Calidad, confianza y servicio excepcional.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="https://wa.me/50246771691" target="_blank" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Enlaces rápidos -->
          <div>
            <h4 class="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul class="space-y-3">
              <li><RouterLink to="/" class="text-gray-400 hover:text-orange-500 transition-colors">Inicio</RouterLink></li>
              <li><RouterLink to="/products" class="text-gray-400 hover:text-orange-500 transition-colors">Productos</RouterLink></li>
              <li><a href="#features" @click="scrollToFeatures" class="text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">Servicios</a></li>
              <li><a href="https://wa.me/50246771691" target="_blank" class="text-gray-400 hover:text-orange-500 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Contacto -->
          <div>
            <h4 class="text-lg font-semibold mb-6">Contacto</h4>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Guatemala City, GT</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+502 4677-1691</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Lun - Sáb: 8:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p class="text-gray-400">
            &copy; 2025 Mi Ferretería PRO. Todos los derechos reservados. 
            <span class="text-orange-500">Construyendo el futuro de Guatemala.</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const featuredProducts = ref([
  { id: 1, name: 'Taladro Pro', description: 'Potente y duradero para cualquier proyecto.', price: '750' },
  { id: 2, name: 'Sierra Circular', description: 'Corte preciso y rápido.', price: '620' },
  { id: 3, name: 'Llave Inglesa', description: 'Ideal para trabajos de fontanería.', price: '320' },
])

const scrollToFeatures = () => {
  const el = document.getElementById('features')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const scrollToProducts = () => {
  const el = document.getElementById('products')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const contactWhatsApp = () => {
  window.open('https://wa.me/50246771691', '_blank')
}

// Animaciones al hacer scroll
const handleScroll = () => {
  const elements = document.querySelectorAll('.transform')
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('opacity-100')
    } else {
      element.classList.remove('opacity-100')
    }
  })
}

// Efecto parallax suave
const handleParallax = () => {
  const scrolled = window.pageYOffset
  const parallax = document.querySelector('.hero-bg')
  if (parallax) {
    const speed = scrolled * 0.5
    parallax.style.transform = `translateY(${speed}px)`
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleParallax)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', handleParallax)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes slideInFromLeft {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

.animate-slide-in-left {
  animation: slideInFromLeft 0.8s ease-out;
}

.bg-gradient-orange {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-green {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.tool-shadow {
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3));
}

.hero-bg {
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 183, 77, 0.1) 0%, transparent 50%);
}
</style>