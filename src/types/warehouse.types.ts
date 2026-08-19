export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  capacity: number;
  usedCapacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FULL';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVER_STOCK';
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  code: string;
  type: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT';
  warehouseName: string;
  itemsCount: number;
  totalQuantity: number;
  creator: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}
