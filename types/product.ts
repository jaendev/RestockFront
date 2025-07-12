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
  stockStatus: "Normal Stock" | "Low Stock" | "Out of Stock" | "Critical Stock";

  // Calculated values
  totalValue: number;
  daysOld: number;
}

export interface CantProducts {
  totalProducts: number;
  timestamp: Timestamp;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  currentStock: number;
  minimumStock: number;
  unitId: number;
  price?: number;
  categoryId: number;
  imageUrl?: string | null | undefined;
}

export interface UnitType {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductDto> {
  id: number;
}
