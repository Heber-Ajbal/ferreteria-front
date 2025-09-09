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
];

export default createRouter({
  history: createWebHistory(),
  routes,
});

