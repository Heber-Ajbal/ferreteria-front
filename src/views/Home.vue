<template>
  <div class="bg-gradient-to-b from-blue-50 to-indigo-100 text-black font-sans relative">
    <!-- Hero -->
    <header id="inicio" class="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
      <div class="max-w-5xl mx-auto px-6">
        <h1 class="text-5xl font-extrabold flex items-center justify-center gap-4 mb-6">
          🛠️ Ferretería El Tornillo Feliz
        </h1>
        <p class="text-lg mb-8 text-gray-100">
          Todo lo que necesitas en un solo lugar. Herramientas, materiales y asesoría de confianza.
        </p>
 <router-link
  to="/products"
  class="bg-white text-gray-800 font-bold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition inline-block"
>
  Ver Productos Ahora
</router-link>



      </div>
    </header>

    <!-- Servicios -->
    <section id="servicios" class="py-20 max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
      <div class="grid md:grid-cols-3 gap-10">
        <div class="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <div class="text-5xl mb-4">🚚</div>
          <h3 class="text-xl font-semibold mb-2">Envíos a domicilio</h3>
          <p class="text-gray-600">Recibe tus productos sin salir de casa.</p>
        </div>
        <div class="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <div class="text-5xl mb-4">🔧</div>
          <h3 class="text-xl font-semibold mb-2">Asesoría técnica</h3>
          <p class="text-gray-600">Te ayudamos a elegir la mejor herramienta.</p>
        </div>
        <div class="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <div class="text-5xl mb-4">🏗️</div>
          <h3 class="text-xl font-semibold mb-2">Material de construcción</h3>
          <p class="text-gray-600">Todo para tus proyectos grandes o pequeños.</p>
        </div>
      </div>
    </section>

 <!-- Productos -->
<section id="productos" class="py-20 max-w-6xl mx-auto px-6">
  <h2 class="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
  <div class="grid md:grid-cols-3 gap-10">
    
    <!-- Producto 1 -->
    <div class="bg-white p-6 border rounded-xl shadow hover:shadow-lg transition text-center">
      <div class="text-6xl mb-4">🔨</div>
      <h3 class="text-xl font-semibold mb-2">Martillo reforzado</h3>
      <p class="mb-4 text-gray-600">Resistente y durable para todo tipo de trabajos.</p>
      <router-link
        to="/products"
        class="bg-white text-gray-800 font-bold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition inline-block"
      >
        Comprar
      </router-link>
    </div>
    
    <!-- Producto 2 -->
    <div class="bg-white p-6 border rounded-xl shadow hover:shadow-lg transition text-center">
      <div class="text-6xl mb-4">🛠️</div>
      <h3 class="text-xl font-semibold mb-2">Taladro eléctrico</h3>
      <p class="mb-4 text-gray-600">Potencia y precisión en cada perforación.</p>
      <router-link
        to="/products"
        class="bg-white text-gray-800 font-bold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition inline-block"
      >
        Comprar
      </router-link>
    </div>

    <!-- Producto 3 -->
    <div class="bg-white p-6 border rounded-xl shadow hover:shadow-lg transition text-center">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-xl font-semibold mb-2">Caja de herramientas</h3>
      <p class="mb-4 text-gray-600">Organiza todas tus herramientas en un solo lugar.</p>
      <router-link
        to="/products"
        class="bg-white text-gray-800 font-bold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition inline-block"
      >
        Comprar
      </router-link>
    </div>

  </div>
</section>


    <!-- Testimonios -->
    <section id="testimonios" class="py-20 bg-indigo-50">
      <h2 class="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
      <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        <div class="bg-white p-6 rounded-xl shadow text-center">
          <p class="italic text-gray-600">“Excelente servicio y productos de calidad.”</p>
          <h4 class="mt-4 font-bold">Carlos M.</h4>
        </div>
        <div class="bg-white p-6 rounded-xl shadow text-center">
          <p class="italic text-gray-600">“Siempre encuentro lo que necesito para mis proyectos.”</p>
          <h4 class="mt-4 font-bold">María L.</h4>
        </div>
        <div class="bg-white p-6 rounded-xl shadow text-center">
          <p class="italic text-gray-600">“El envío fue rápido y la atención excelente.”</p>
          <h4 class="mt-4 font-bold">José R.</h4>
        </div>
      </div>
    </section>

    <!-- Ubicación -->
    <section id="contacto" class="py-20 max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold mb-6">Visítanos</h2>
      <p class="mb-6 text-gray-700">Estamos en San Lucas Tolimán, Sololá</p>
      <iframe
        class="w-full h-80 rounded-xl shadow"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.4898016553263!2d-91.1403!3d14.6351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858940d16dc6ad3f%3A0xf6a8a79af9e8f6ed!2sSan%20Lucas%20Tolim%C3%A1n%2C%20Solol%C3%A1!5e0!3m2!1ses-419!2sgt!4v1694302512345"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </section>

    <!-- Footer -->
    <footer class="py-6 text-center text-gray-600 bg-gray-200">
      <p>© 2025 Ferretería El Tornillo Feliz. Todos los derechos reservados.</p>
      <div class="mt-2 flex justify-center space-x-4">
        <a href="#inicio" class="hover:text-blue-600">Inicio</a>
        <a href="#servicios" class="hover:text-blue-600">Servicios</a>
        <a href="#productos" class="hover:text-blue-600">Productos</a>
        <a href="#contacto" class="hover:text-blue-600">Contacto</a>
      </div>
    </footer>

    <!-- Botón flotante de WhatsApp -->
    <a
      href="https://wa.me/50246771691?text=Hola%20quiero%20más%20información%20sobre%20la%20ferretería"
      target="_blank"
      class="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.16 1.61 5.97L0 24l6.24-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.48-8.52zM12 22c-1.77 0-3.48-.46-4.98-1.34l-.36-.21-3.7.97.99-3.61-.23-.37A9.92 9.92 0 0 1 2 12C2 6.49 6.49 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.9 9.9 0 0 1 22 12c0 5.51-4.49 10-10 10zm5.2-7.59c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.73.93-.89 1.12-.16.19-.33.21-.62.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36s-1 1-1 2.45c0 1.45 1.02 2.85 1.16 3.05.14.19 2 3.05 4.85 4.28.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"
        />
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
