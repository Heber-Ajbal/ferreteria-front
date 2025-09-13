import { defineStore } from "pinia";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;   // en tu moneda
  qty: number;
  image_url?: string;
};

type State = {
  items: CartItem[];
};

const KEY = "cart";

export const useCartStore = defineStore("cart", {
  state: (): State => ({
    items: JSON.parse(localStorage.getItem(KEY) || "[]"),
  }),
  getters: {
    count: (s) => s.items.reduce((acc, i) => acc + i.qty, 0),
    subtotal: (s) => s.items.reduce((acc, i) => acc + i.price * i.qty, 0),
    tax: (s) => s.items.reduce((acc, i) => acc + i.price * i.qty, 0) * 0.12, // IVA 12% (ajústalo)
    shipping: (s) => (s.items.length ? 30 : 0), // flat (ejemplo)
    total(): number {
      return this.subtotal + this.tax + this.shipping;
    },
  },
  actions: {
    persist() {
      localStorage.setItem(KEY, JSON.stringify(this.items));
    },
    add(item: CartItem) {
      const ex = this.items.find((i) => i.id === item.id);
      if (ex) ex.qty += item.qty;
      else this.items.push({ ...item });
      this.persist();
    },
    setQty(id: CartItem["id"], qty: number) {
      const it = this.items.find((i) => i.id === id);
      if (!it) return;
      it.qty = Math.max(1, qty);
      this.persist();
    },
    remove(id: CartItem["id"]) {
      this.items = this.items.filter((i) => i.id !== id);
      this.persist();
    },
    clear() {
      this.items = [];
      this.persist();
    },
  },
});
