export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type FilterType = 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: any;
  span?: number;
}

export interface ActionLogItem {
  id: string;
  action: string;
  username: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: string;
}
