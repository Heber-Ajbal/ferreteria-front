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

  // ADMIN: Usuarios (solo admins)
  {
    path: "/admin/users",
    name: "users-admin",
    component: () => import("../views/users/UsersAdmin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // ADMIN productos (solo admins)
  {
    path: "/products/admin",
    name: "products-admin",
    component: () => import("../views/products/ProductsAdmin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/products/new",
    name: "product-new",
    component: () => import("../views/products/ProductForm.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/products/edit/:id",
    name: "product-edit",
    component: () => import("../views/products/ProductForm.vue"),
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // Detalle producto
  {
    path: "/product/:id",
    name: "product-detail",
    component: () => import("../views/products/ProductDetail.vue"),
    alias: ["/products/:id"],
    props: (route) => ({ id: Number(route.params.id) || route.params.id }),
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; },
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // hidratar sesión (token + user)
  await auth.ensureSession();

  const isLoggedIn = auth.isLoggedIn;
  const isAdmin    = auth.isAdmin;

  if (to.name === "login" && isLoggedIn) return { name: "home" };

  if (to.meta?.requiresAuth && !isLoggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta?.requiresAdmin && !isAdmin) {
    return { name: "home" }; // o una /403 si quieres
  }
});

export default router;
