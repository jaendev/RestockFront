import { apiClient } from "@/api/apiClient";
import {
  CantProducts,
  CreateProductDto,
  Product,
  UpdateProductRequest,
  UpdateProductDto,
} from "@/types/product";

export const getProducts = () =>
  apiClient.get<Product[]>("/product/getProducts");
export const getCantProducts = () =>
  apiClient.get<CantProducts>("/product/getCantProducts");
export const getCantLowStockProducts = () =>
  apiClient.get<CantProducts>("/product/getCantLowStockProducts");
export const getProductsById = (productId: number) =>
  apiClient.get<Product>(`/product/getProductById/${productId}`);
export const createProduct = (productData: CreateProductDto) =>
  apiClient.post<Product>("/product/createProduct", productData);
export const updateStock = (productId: number, newQuantity: number) =>
  apiClient.patch<UpdateProductRequest>(`/product/updateStock/${productId}`, {
    newStock: newQuantity,
  });
export const updateProduct = (
  productId: number,
  productData: UpdateProductDto,
) =>
  apiClient.patch<Product>(`/product/updateProduct/${productId}`, productData);
