<template>
  <div class="terminal">
    <header class="top">
      <h2>Terminal de Pago</h2>
      <div class="user">
        <template v-if="userStore.isLogged">
          <span>Usuario: {{ userStore.user?.nombre }}</span>
          <button @click="logout">Cerrar sesión</button>
        </template>
        <template v-else>
          <router-link to="/auth/login">Iniciar sesión</router-link>
        </template>
      </div>
    </header>

    <main class="grid">
      <section class="products">
        <div class="controls">
          <input v-model="query" placeholder="Buscar producto por nombre o código" @input="onSearch" />
          <select v-model.number="selectedCategory" @change="onSearch">
            <option :value="0">Todas las categorías</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <div class="lista">
          <div v-for="p in filtered" :key="p.idProducto" class="card">
            <div class="card-info">
              <strong>{{ p.nombre }}</strong>
              <small>{{ p.descripcion }}</small>
              <div>Precio: Q{{ p.precio.toFixed(2) }}</div>
              <div v-if="p.esPerecedero">Perecedero</div>
              <div>Stock: {{ p.stock ?? 'N/A' }}</div>
            </div>
            <div class="card-actions">
              <input type="number" v-model.number="qty[p.idProducto]" min="1" :max="p.stock ?? 9999" />
              <button @click="addToCart(p)">Agregar</button>
            </div>
          </div>
        </div>

        <router-link to="/admin/products">Administrar productos</router-link>
      </section>

      <aside class="checkout">
        <h3>Carrito</h3>
        <div class="cart-list">
          <div v-for="item in cart.items" :key="item.idProducto" class="cart-row">
            <div class="cart-name">{{ item.nombre }} x{{ item.cantidad }}</div>
            <div class="cart-price">Q{{ (item.precio * item.cantidad).toFixed(2) }}</div>
            <div class="cart-actions">
              <button @click="decrease(item.idProducto)">-</button>
              <button @click="increase(item.idProducto)">+</button>
              <button @click="remove(item.idProducto)">x</button>
            </div>
          </div>
        </div>

        <div class="totals">
          <div>Subtotal: Q{{ subtotal.toFixed(2) }}</div>
          <div>IVA (12%): Q{{ tax.toFixed(2) }}</div>
          <div class="total">Total: Q{{ total.toFixed(2) }}</div>
        </div>

        <div class="payments">
          <button @click="startPayment('efectivo')" :disabled="cart.items.length===0">Pagar Efectivo</button>
          <button @click="startPayment('tarjeta')" :disabled="cart.items.length===0">Pagar Tarjeta</button>
        </div>

        <div v-if="showPayment" class="payment-modal">
          <h4>Pagar - {{ paymentMethod }}</h4>
          <div v-if="paymentMethod==='efectivo'">
            <label>Recibido:</label>
            <input type="number" v-model.number="received" />
            <div v-if="change>=0">Cambio: Q{{ change.toFixed(2) }}</div>
          </div>
          <div v-else>
            <label>Tarjeta (simulado)</label>
            <input placeholder="Últimos 4 dígitos" v-model="cardLast4" />
          </div>
          <div class="pay-actions">
            <button @click="confirmPayment">Confirmar</button>
            <button @click="cancelPayment">Cancelar</button>
          </div>
        </div>

        <div v-if="message" class="message">{{ message }}</div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const productsStore = useProductsStore();
const cart = useCartStore();
const userStore = useUserStore();
const router = useRouter();

const query = ref('');
const selectedCategory = ref(0);
const qty = reactive<Record<number, number>>({});
const showPayment = ref(false);
const paymentMethod = ref('');
const received = ref(0);
const cardLast4 = ref('');
const message = ref('');

onMounted(() => {
  productsStore.load();
});

const categories = computed(() => productsStore.categories || []);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return productsStore.products.filter(p => {
    if (selectedCategory.value && p.idCategoria !== selectedCategory.value) return false;
    if (!q) return true;
    return (p.nombre + ' ' + (p.descripcion||'') + ' ' + (p.idProducto||'')).toLowerCase().includes(q);
  });
});

function onSearch(){
  // ensure default qty values
  for(const p of filtered.value){
    if(!qty[p.idProducto]) qty[p.idProducto]=1;
  }
}

function addToCart(p){
  const cantidad = qty[p.idProducto] || 1;
  cart.addItem({
    idProducto: p.idProducto,
    nombre: p.nombre,
    precio: p.precio,
    cantidad
  });
  message.value = `Agregado ${cantidad} x ${p.nombre}`;
  setTimeout(()=>message.value='',2000);
}

const subtotal = computed(()=>cart.subtotal);
const tax = computed(()=>+(subtotal.value * 0.12));
const total = computed(()=>+(subtotal.value + tax.value));

function increase(id){ cart.increment(id); }
function decrease(id){ cart.decrement(id); }
function remove(id){ cart.removeItem(id); }

function startPayment(method){
  if(!userStore.isLogged){ message.value='Debe iniciar sesión para procesar pagos.'; return; }
  paymentMethod.value = method;
  showPayment.value = true;
  received.value = total.value;
}

const change = computed(()=> (received.value - total.value));

function confirmPayment(){
  // basic validations
  if(paymentMethod.value==='efectivo' && received.value < total.value){ message.value='Dinero insuficiente.'; return; }
  if(paymentMethod.value==='tarjeta' && cardLast4.value.length<3){ message.value='Ingrese últimos dígitos de la tarjeta.'; return; }

  // simulate transaction: reduce stock
  for(const it of cart.items){
    productsStore.decreaseStock(it.idProducto, it.cantidad);
  }

  // register sale (simple console log)
  const sale = {
    user: userStore.user?.nombre || 'Anónimo',
    items: [...cart.items],
    subtotal: subtotal.value,
    tax: tax.value,
    total: total.value,
    method: paymentMethod.value,
    timestamp: new Date().toISOString()
  };
  console.log('Venta registrada', sale);

  cart.clear();
  showPayment.value=false;
  message.value = 'Pago completado. ¡Gracias!';
  setTimeout(()=>message.value='',3000);
}

function cancelPayment(){ showPayment.value=false; }

function logout(){ userStore.logout(); router.push('/'); }
</script>

<style scoped>
.terminal{padding:12px;font-family:Inter, Arial, sans-serif}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.grid{display:grid;grid-template-columns:2fr 1fr;gap:12px}
.products{background:#fff;padding:10px;border-radius:8px}
.checkout{background:#fff;padding:10px;border-radius:8px}
.card{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #eee}
.card-actions input{width:68px}
.cart-row{display:flex;justify-content:space-between;padding:6px;border-bottom:1px dashed #ddd}
.payment-modal{background:#f8f8f8;padding:8px;margin-top:8px;border-radius:6px}
.message{margin-top:8px;color:green}
</style>
