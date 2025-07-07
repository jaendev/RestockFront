import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface Category {
  // Basic category information
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;

  // Timestamps
  createdAt: string;

  // Product statistics
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;

  // Financial information
  totalCategoryValue: number;

  // Time calculations
  daysOld: number;
}

export interface CantCategories {
  totalCategories: number,
  timestamp: Timestamp
}


export interface CreateCategoryRequest {
  name: string;
  color: string;
}
