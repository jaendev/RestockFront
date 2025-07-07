import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface Product {
  // Basic product info
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;

  // Stock management
  currentStock: number;
  minimumStock: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Unit information
  unitId: number;
  unitName: string;
  unitSymbol: string;

  // Category information
  categoryId: number;
  categoryName: string;
  categoryColor: string;

  // Computed stock status
  isLowStock: boolean;
  isOutOfStock: boolean;
  stockStatus: 'Normal Stock' | 'Low Stock' | 'Out of Stock' | 'Critical Stock';

  // Calculated values
  totalValue: number;
  daysOld: number;
}

export interface CantProducts {
  totalProducts: number,
  timestamp: Timestamp
}

export interface CreateProductRequest {
  name: string;
  categoryId: number;
  quantity: number;
  minStock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}
