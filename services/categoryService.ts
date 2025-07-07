import { apiClient } from "@/api/apiClient";
import { CantCategories, Category } from "@/types/category";

export const getCategories = () => apiClient.get<Category[]>('/category/getCategories')
export const getCantCategories = () => apiClient.get<CantCategories>('/category/getCantCategories')