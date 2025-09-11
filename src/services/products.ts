import api from "../lib/api";

export type Product = {
  product_id: number;
  name: string;
  sku?: string;
  sale_price?: number;
  image_url?: string;
  stock?: number;
  categories?: { id: number; name: string };
  brands?: { id: number; name: string };
  // ...otros campos que uses
};

export type ProductsResponse = {
  data: Product[];
  meta: { page: number; pageSize: number; total: number };
};

export async function getProducts(params: {
  search?: string;
  categoryId?: number;
  brandId?: number;
  page?: number;
  pageSize?: number;
}): Promise<ProductsResponse> {
  const res = await api.get("/catalog/products", { params });

  // Soporta { data, meta } (backend) y también { items, meta } por si algo quedó cacheado
  const lvl1 = res?.data ?? {};
  const rows = Array.isArray(lvl1.data) ? lvl1.data : (Array.isArray(lvl1.items) ? lvl1.items : []);
  const meta = lvl1.meta ?? { page: params.page ?? 1, pageSize: params.pageSize ?? 20, total: rows.length };

  return { data: rows, meta };
}

export async function getProduct(id: number) {
  const res = await api.get(`/catalog/products/${id}`);
  return res.data; 
}


export async function getCategories() {
  // Si ya tienes endpoint /catalog/categories
  const { data } = await api.get<{ data: Array<{ category_id: number; name: string }> }>(
    "/catalog/categories",
    { params: { page: 1, pageSize: 100 } }
  );
  return data.data.map(c => ({ id: c.category_id, name: c.name }));
}

export async function getBrands() {
  // Si ya tienes endpoint /catalog/brands
  const { data } = await api.get<{ data: Array<{ brand_id: number; name: string }> }>(
    "/catalog/brands",
    { params: { page: 1, pageSize: 100 } }
  );
  return data.data.map(b => ({ id: b.brand_id, name: b.name }));
}
