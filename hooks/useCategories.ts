import { getCantCategories, getCategories } from "@/services/categoryService";
import { CantCategories, Category } from "@/types/category";
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>()
  const [cantCategories, setCantCategories] = useState<CantCategories>()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (e: any) {
        setError(e.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    const fetchCantCategories = async () => {
      try {
        const data = await getCantCategories()
        setCantCategories(data)
      } catch (e: any) {
        setError(e.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories()
    fetchCantCategories()
  }, [])

  return { categories, cantCategories, error, loading }
}