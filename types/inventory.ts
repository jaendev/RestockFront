export interface InventoryAlert {
  // Alert identification
  id: number;
  message: string;

  // Product information
  productId: number;
  productName: string;
  categoryName: string;
  categoryColor: string;

  // Alert type information
  alertTypeId: number;
  alertTypeName: string;
  alertTypeColor: string;
  alertTypePriority: string;

  // Alert status information
  alertStatusId: number;
  alertStatusName: string;
  alertStatusColor: string;
  isFinalState: boolean;

  // Timestamps
  createdAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;

  // Status flags
  isActive: boolean;
  isResolved: boolean;
  isAcknowledged: boolean;

  // Time calculations
  daysOld: number;
  hoursOld: number;
  timeAgo: string;
  priority: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  totalCategories: number;
  outOfStockCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'low_stock';
  productName: string;
  timestamp: string;
  description: string;
}
