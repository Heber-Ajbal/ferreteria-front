import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import ProductsList from "../views/products/ProductsList.vue";
import CartPage from "../views/cart/CartPage.vue";
import Login from "../views/auth/Login.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/products", name: "products", component: ProductsList },
  { path: "/cart", name: "cart", component: CartPage },
  { path: "/auth/login", name: "login", component: Login },

  // Administrador de productos
  {
    path: "/products/admin",
    name: "products-admin",
    component: () => import("../views/products/ProductsAdmin.vue"),
  },

  // Crear nuevo producto
  {
    path: "/products/new",
    name: "product-new",
    component: () => import("../views/products/ProductForm.vue"),
  },

  // Editar producto existente
  {
    path: "/products/edit/:id",
    name: "product-edit",
    component: () => import("../views/products/ProductForm.vue"),
    props: true,
  },

  // Ruta comodín para redirigir a Home si no se encuentra
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
