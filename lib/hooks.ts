import { useEffect, useState, useCallback } from "react";
import { type Product } from "@/components/ProductCard";
import {
  productAPI,
  categoryAPI,
  brandAPI,
  mapBackendProductToProduct,
} from "./api";
import type { Category, Brand } from "./types";

export type { Category, Brand };

export interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
  callout?: string;
  alt?: string;
  status?: string;
}

/**
 * Fetch products with pagination and filtering using NestJS productAPI
 */
export function useProducts(
  page: number = 1,
  limit: number = 20,
  category?: string
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await productAPI.getAll({
        page,
        limit,
        category,
      });

      const items = response?.items || [];
      const transformed = items.map(mapBackendProductToProduct);

      setProducts(transformed);
      setHasMore(response ? response.page < response.totalPages : false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, hasMore, refetch: fetchProducts };
}

/**
 * Fetch categories using NestJS categoryAPI
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await categoryAPI.getAll();
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch categories";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

/**
 * Fetch brands using NestJS brandAPI
 */
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await brandAPI.getAll();
      setBrands(Array.isArray(response) ? response : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch brands";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, isLoading, error, refetch: fetchBrands };
}

/**
 * Fetch banners (graceful fallback)
 */
export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    // Single merchant luxury backend has no banners table; return empty array safely
    setBanners([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, isLoading, error, refetch: fetchBanners };
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: string | string[] | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const idStr = Array.isArray(id) ? id[0] : id;
      const response = await productAPI.getById(idStr);
      setProduct(mapBackendProductToProduct(response));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch product";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(
  slug: string | string[] | undefined,
  page: number = 1,
  limit: number = 20
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const slugStr = Array.isArray(slug) ? slug.join("/") : slug;
      const response = await productAPI.getAll({
        category: slugStr === "all" ? undefined : slugStr,
        page,
        limit,
      });

      const items = response?.items || [];
      const transformed = items.map(mapBackendProductToProduct);

      setProducts(transformed);
      setHasMore(response ? response.page < response.totalPages : false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [slug, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, hasMore, refetch: fetchProducts };
}
