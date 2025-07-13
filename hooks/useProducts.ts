import {
  getCantLowStockProducts,
  getCantProducts,
  getProducts,
  getProductsById,
} from "@/services/productService";
import { CantProducts, type Product } from "@/types/product";
import { useEffect, useState } from "react";

export function useProducts(productId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [cantProducts, setCantProducts] = useState<CantProducts>();
  const [cantLowStockProducts, setCantLowStockProducts] =
    useState<CantProducts>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, cantProductsData, cantLowStockData] =
        await Promise.all([
          getProducts(),
          getCantProducts(),
          getCantLowStockProducts(),
        ]);
      setProducts(productsData);
      setCantProducts(cantProductsData);
      setCantLowStockProducts(cantLowStockData);

      if (productId) {
        const productData = await getProductsById(productId);
        setProduct(productData);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsData, cantProductsData, cantLowStockData] =
          await Promise.all([
            getProducts(),
            getCantProducts(),
            getCantLowStockProducts(),
          ]);

        setProducts(productsData);
        setCantProducts(cantProductsData);
        setCantLowStockProducts(cantLowStockData);

        if (productId) {
          const productData = await getProductsById(productId);
          setProduct(productData);
        }
      } catch (e: any) {
        setError(e.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return {
    products,
    product,
    cantProducts,
    cantLowStockProducts,
    loading,
    error,
    refetch,
  };
}
