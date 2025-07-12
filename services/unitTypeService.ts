import { apiClient } from "@/api/apiClient";
import { UnitType } from "@/types/unitType";

export const getUnitTypes = async () =>
  apiClient.get<UnitType[]>("/unitTypes/getUnitTypes");
