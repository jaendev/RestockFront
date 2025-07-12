import { apiClient } from "@/api/apiClient";
import { CantProducts, CreateProductDto, Product } from "@/types/product";

export const getProducts = () => apiClient.get<Product[]>('/product/getProducts')
export const getCantProducts = () => apiClient.get<CantProducts>('/product/getCantProducts')
export const getCantLowStockProducts = () => apiClient.get<CantProducts>('/product/getCantLowStockProducts')
export const getProductsById = (productId: number) => apiClient.get<Product>(`/product/getProductById/${productId}`)
export const createProduct = (productData: CreateProductDto) => apiClient.post<Product>('/product/createProduct', productData)
