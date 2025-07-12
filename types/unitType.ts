export interface UnitType {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  displayName: string;
  daysOld: number;
}

export interface CreateUnitTypeDto {
  name: string;
  symbol: string;
  description?: string;
}

export interface UpdateUnitTypeDto {
  name?: string;
  symbol?: string;
  description?: string;
  isActive?: boolean;
}

export interface UnitTypeWithStats extends UnitType {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  daysOld: number;
}

export interface CantUnitTypes {
  totalUnitTypes: number;
  timestamp: string;
}
