import { getCantCategories, getCategories } from "@/services/categoryService";
import { CantCategories, Category } from "@/types/category";
import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>()
  const [cantCategories, setCantCategories] = useState<CantCategories>()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories()
      setCategories(data)
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories count function
  const fetchCantCategories = useCallback(async () => {
    try {
      const data = await getCantCategories()
      setCantCategories(data)
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    }
  }, []);

  // Refetch function to refresh all data
  const refetch = useCallback(async () => {
    await Promise.all([
      fetchCategories(),
      fetchCantCategories()
    ]);
  }, [fetchCategories, fetchCantCategories]);

  // Initial load
  useEffect(() => {
    fetchCategories()
    fetchCantCategories()
  }, [fetchCategories, fetchCantCategories])

  return { 
    categories, 
    cantCategories, 
    error, 
    loading,
    refetch 
  }
}