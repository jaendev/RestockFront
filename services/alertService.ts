import { apiClient } from "@/api/apiClient";
import { InventoryAlert } from "@/types/inventory";

export const getInvetoryAlert = () => apiClient.get<InventoryAlert[]>('/alert/getActiveAlerts')