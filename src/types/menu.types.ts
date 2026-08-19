export interface MenuItem {
  key: string;
  titleKey: string;
  defaultTitle: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
  badge?: string | number;
  hideInMenu?: boolean;
}

export interface TabItem {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
  pinned?: boolean;
  icon?: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}
