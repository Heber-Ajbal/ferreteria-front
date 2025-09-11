// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductsList from "../views/products/ProductsList.vue";
import CartPage from "../views/cart/CartPage.vue";
import Login from "../views/auth/Login.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/products", name: "products", component: ProductsList },
  { path: "/cart", name: "cart", component: CartPage },
  { path: "/auth/login", name: "login", component: Login },

  // admin primero (rutas más específicas antes de las dinámicas)
  { path: "/products/admin", name: "products-admin", component: () => import("../views/products/ProductsAdmin.vue"), meta: { requiresAuth: true } },
  { path: "/products/new", name: "product-new", component: () => import("../views/products/ProductForm.vue"), meta: { requiresAuth: true } },
  { path: "/products/edit/:id", name: "product-edit", component: () => import("../views/products/ProductForm.vue"), props: true, meta: { requiresAuth: true } },

  // detalle producto (lazy) con alias para /products/:id
  {
    path: "/product/:id",
    name: "product-detail",
    component: () => import("../views/products/ProductDetail.vue"),
    alias: ["/products/:id"],                 // opcional
    props: route => ({ id: Number(route.params.id) || route.params.id }) // opcional si quieres recibir "id" como prop
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; },   // 👈 sube al top al navegar
});

// guard de auth igual que tenías
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.token) {
    const token = localStorage.getItem("accessToken"); // ⚠️ usa la misma key que tu interceptor
    if (token) auth.token = token;
  }
  const isLoggedIn = !!auth.token;
  if (to.name === "login" && isLoggedIn) return { name: "home" };
  if (to.meta?.requiresAuth && !isLoggedIn) return { name: "login", query: { redirect: to.fullPath } };
});
export default router;
