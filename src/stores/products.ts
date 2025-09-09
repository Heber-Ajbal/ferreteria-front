import { defineStore } from "pinia";

export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  emoji?: string;
};

type State = {
  products: Product[];
};

const KEY = "products";

const seed: Product[] = [
  { id: 1, name: "Martillo Profesional", price: 150, description: "Martillo de carpintero con mango ergonómico", emoji: "🔨" },
  { id: 2, name: "Taladro Inalámbrico", price: 800, description: "Taladro de 18V con batería de larga duración", emoji: "🔧" },
  { id: 3, name: "Set de Destornilladores", price: 75, description: "Kit de destornilladores de precisión", emoji: "🪛" },
  { id: 4, name: "Llave Inglesa", price: 120, description: "Llave ajustable de acero resistente", emoji: "🔧" },
];

export const useProductsStore = defineStore("products", {
  state: (): State => ({
    products: [],
  }),
  getters: {
    count: (s) => s.products.length,
    byId: (s) => (id: number) => s.products.find(p => p.id === id),
  },
  actions: {
    init() {
      try {
        const raw = localStorage.getItem(KEY);
        this.products = raw ? JSON.parse(raw) : seed.slice();
      } catch (e) {
        this.products = seed.slice();
      }
      this.persist();
    },
    persist() {
      localStorage.setItem(KEY, JSON.stringify(this.products));
    },
    add(product: Omit<Product, "id">) {
      const nextId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products.push({ id: nextId, ...product });
      this.persist();
    },
    update(id: number, patch: Partial<Omit<Product, "id">>) {
      const idx = this.products.findIndex(p => p.id === id);
      if (idx === -1) return;
      this.products[idx] = { ...this.products[idx], ...patch };
      this.persist();
    },
    remove(id: number) {
      this.products = this.products.filter(p => p.id !== id);
      this.persist();
    },
    clear() {
      this.products = [];
      this.persist();
    }
  }
});
