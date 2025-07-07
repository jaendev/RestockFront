import { getInvetoryAlert } from "@/services/alertService";
import { InventoryAlert } from "@/types/inventory";
import { useEffect, useState } from "react";

export function useAlert() {
  const [alerts, setAlert] = useState<InventoryAlert[]>()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const data = await getInvetoryAlert()
        setAlert(data)
      } catch (e: any) {
        setError(e.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchAlert()
  }, [])

  return { alerts, error, loading }
}