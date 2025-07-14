import { apiClient } from "@/api/apiClient";
import { CantCategories, Category, CreateCategoryRequest, UpdateCategoryDto } from "@/types/category";

// Get all categories
export const getCategories = () => 
  apiClient.get<Category[]>('/category/getCategories');

// Get categories count
export const getCantCategories = () => 
  apiClient.get<CantCategories>('/category/getCantCategories');

// Get category by ID
export const getCategoryById = (categoryId: number) =>
  apiClient.get<Category>(`/category/getCategoryById/${categoryId}`);

// Create new category
export const createCategory = (categoryData: CreateCategoryRequest) =>
  apiClient.post<Category>('/category/createCategory', categoryData);

// Update existing category
export const updateCategory = (categoryId: number, categoryData: UpdateCategoryDto) =>
  apiClient.patch<Category>(`/category/updateCategory/${categoryId}`, categoryData);

// Delete category (soft delete)
export const deleteCategory = (categoryId: number) =>
  apiClient.delete<void>(`/category/deleteCategory/${categoryId}`);