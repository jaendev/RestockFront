import { getUnitTypes } from "@/services/unitTypeService";
import { UnitType } from "@/types/unitType";
import { useEffect, useState } from "react";

export function useUnitTypes() {
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [unitTypeData] = await Promise.all([getUnitTypes()]);
        setUnitTypes(unitTypeData);
      } catch (e: any) {
        setError(e.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    unitTypes,
    loading,
    error,
  };
}
