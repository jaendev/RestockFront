import { useState, useMemo } from "react";
import { Product } from "@/types/product";

export function useProductSearch(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    return (
      products?.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    );
  }, [products, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
  };
}
