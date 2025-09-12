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

export type ProductPayload = {
  sku: string;
  name: string;
  categoryId?: number;
  brandId?: number;
  unitId: number;
  barcode?: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  isTaxable: boolean;
  minStock: number;
  // imageUrl?: string; // si lo agregas en backend
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

export async function getUnits() {
  const { data } = await api.get("/catalog/units", { params: { pageSize: 500 } });
  return (data?.data || []).map((u:any) => ({ id: u.unit_id, code: u.code, name: u.name })) as Array<{id:number; code:string; name:string}>;
}

export async function createProduct(payload: ProductPayload) {
  const body = {
    sku: payload.sku,
    name: payload.name,
    categoryId: payload.categoryId ?? undefined,
    brandId: payload.brandId ?? undefined,
    unitId: payload.unitId,
    barcode: payload.barcode ?? undefined,
    description: payload.description ?? undefined,
    costPrice: payload.costPrice,
    salePrice: payload.salePrice,
    isTaxable: payload.isTaxable,
    minStock: payload.minStock,
  };
  const { data } = await api.post("/catalog/products", body);
  return data;
}

export async function updateProduct(id:number, payload: ProductPayload) {
  const body = {
    sku: payload.sku,
    name: payload.name,
    categoryId: payload.categoryId ?? undefined,
    brandId: payload.brandId ?? undefined,
    unitId: payload.unitId,
    barcode: payload.barcode ?? undefined,
    description: payload.description ?? undefined,
    costPrice: payload.costPrice,
    salePrice: payload.salePrice,
    isTaxable: payload.isTaxable,
    minStock: payload.minStock,
  };
  const { data } = await api.put(`/catalog/products/${id}`, body);
  return data;
}

export async function deleteProduct(id:number) {
  const { data } = await api.delete(`/catalog/products/${id}`);
  return data;
}
