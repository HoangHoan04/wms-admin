import { PERMISSION_CODES } from "./permission-codes";

export interface RouteConfig {
  key: string;
  label: string;
  translationKey: string;
  path: string;
  icon?: string;
  isShow?: boolean;
  permission?: string;
  children?: Record<string, RouteConfig>;
}

export interface SidebarMenuItem {
  key: string;
  label: string;
  translationKey: string;
  path: string;
  icon?: string;
  isShow?: boolean;
  permission?: string;
  children?: SidebarMenuItem[];
}

export const ROUTES_CONFIG = {
  HOME: {
    key: "HOME",
    label: "routes.home",
    translationKey: "routes.home",
    path: "/",
    icon: "home",
    permission: PERMISSION_CODES.HOME_VIEW,
  },

  ROLE_MANAGER: {
    key: "ROLE_MANAGER",
    label: "routes.roleManager",
    translationKey: "routes.roleManager",
    icon: "safety",
    path: "/role-manager",
    permission: PERMISSION_CODES.ROLE_VIEW,
    children: {
      ACCOUNT_MANAGER: {
        key: "ACCOUNT_MANAGER",
        label: "routes.accountManager",
        translationKey: "routes.accountManager",
        icon: "user",
        path: "/role-manager/accounts",
        permission: PERMISSION_CODES.USER_VIEW,
      },
      ROLE_LIST: {
        key: "ROLE_LIST",
        label: "routes.roleList",
        translationKey: "routes.roleList",
        icon: "team",
        path: "/role-manager/roles",
        permission: PERMISSION_CODES.ROLE_VIEW,
      },
      ACCESS_CONTROL: {
        key: "ACCESS_CONTROL",
        label: "routes.accessControl",
        translationKey: "routes.accessControl",
        icon: "key",
        path: "/role-manager/access",
        permission: PERMISSION_CODES.ROLE_MANAGE,
      },
    },
  },

  SETTING_SYSTEM: {
    key: "SETTING_SYSTEM",
    label: "routes.settingSystem",
    translationKey: "routes.settingSystem",
    icon: "setting",
    path: "/system-settings",
    permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
    children: {
      ACTION_LOG: {
        key: "ACTION_LOG",
        label: "routes.actionLog",
        translationKey: "routes.actionLog",
        icon: "history",
        path: "/system-settings/action-log",
        permission: PERMISSION_CODES.ACTION_LOG_VIEW,
      },
      NOTIFICATION_CENTER: {
        key: "NOTIFICATION_CENTER",
        label: "routes.notificationCenter",
        translationKey: "routes.notificationCenter",
        icon: "bell",
        path: "/system-settings/notification-center",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
      },
      NOTIFICATION_TEMPLATE: {
        key: "NOTIFICATION_TEMPLATE",
        label: "routes.notificationTemplate",
        translationKey: "routes.notificationTemplate",
        icon: "mail",
        path: "/system-settings/notification-template",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
        children: {
          ADD_NOTIFICATION_TEMPLATE: {
            key: "ADD_NOTIFICATION_TEMPLATE",
            label: "routes.addNotificationTemplate",
            translationKey: "routes.addNotificationTemplate",
            path: "/system-settings/notification-template/add",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
          EDIT_NOTIFICATION_TEMPLATE: {
            key: "EDIT_NOTIFICATION_TEMPLATE",
            label: "routes.editNotificationTemplate",
            translationKey: "routes.editNotificationTemplate",
            path: "/system-settings/notification-template/edit",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
        },
      },
      API_KEYS: {
        key: "API_KEYS",
        label: "routes.apiKeys",
        translationKey: "routes.apiKeys",
        icon: "key",
        path: "/system-settings/api-keys",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
        children: {
          ADD_API_KEY: {
            key: "ADD_API_KEY",
            label: "routes.addApiKey",
            translationKey: "routes.addApiKey",
            path: "/system-settings/api-keys/add",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
          EDIT_API_KEY: {
            key: "EDIT_API_KEY",
            label: "routes.editApiKey",
            translationKey: "routes.editApiKey",
            path: "/system-settings/api-keys/edit",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
        },
      },
      SESSIONS: {
        key: "SESSIONS",
        label: "routes.sessions",
        translationKey: "routes.sessions",
        icon: "laptop",
        path: "/system-settings/sessions",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
      },
      IP_ALLOWLIST: {
        key: "IP_ALLOWLIST",
        label: "routes.ipAllowlist",
        translationKey: "routes.ipAllowlist",
        icon: "safety",
        path: "/system-settings/ip-allowlist",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
        children: {
          ADD_IP_ALLOWLIST: {
            key: "ADD_IP_ALLOWLIST",
            label: "routes.addIpAllowlist",
            translationKey: "routes.addIpAllowlist",
            path: "/system-settings/ip-allowlist/add",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
          EDIT_IP_ALLOWLIST: {
            key: "EDIT_IP_ALLOWLIST",
            label: "routes.editIpAllowlist",
            translationKey: "routes.editIpAllowlist",
            path: "/system-settings/ip-allowlist/edit",
            permission: PERMISSION_CODES.SYSTEM_SETTINGS_MANAGE,
            isShow: false,
          },
        },
      },
      SECURITY: {
        key: "SECURITY",
        label: "routes.security",
        translationKey: "routes.security",
        icon: "security-scan",
        path: "/system-settings/security",
        permission: PERMISSION_CODES.SYSTEM_SETTINGS_VIEW,
      },
    },
  },
} as const satisfies Record<string, RouteConfig>;

/**
 * Global static route paths for auth and system errors
 */
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH: "/auth",
} as const;

export const ERROR_ROUTES = {
  SERVER_ERROR: "/500",
  NOT_FOUND: "/:pathMatch(.*)*",
} as const;

export function getRouteByPath(path: string): RouteConfig | undefined {
  const routes = ROUTES_CONFIG as unknown as Record<string, RouteConfig>;
  let bestMatch: RouteConfig | undefined = undefined;

  const traverse = (routeList: Record<string, RouteConfig>) => {
    for (const key of Object.keys(routeList)) {
      const r = routeList[key];
      if (path === r.path) {
        bestMatch = r;
        return;
      }
      if (r.path !== "/" && path.startsWith(r.path + "/")) {
        if (!bestMatch || r.path.length > bestMatch.path.length) {
          bestMatch = r;
        }
      }
      if (r.children) {
        traverse(r.children as Record<string, RouteConfig>);
      }
    }
  };

  traverse(routes);
  return bestMatch;
}

export function getFirstNavigableRoute(route: RouteConfig): RouteConfig {
  if (!route.children || Object.keys(route.children).length === 0) {
    return route;
  }
  const childKeys = Object.keys(route.children);
  for (const k of childKeys) {
    const child = route.children[k];
    if (child && child.isShow !== false) {
      return getFirstNavigableRoute(child);
    }
  }
  return childKeys.length > 0
    ? getFirstNavigableRoute(route.children[childKeys[0]])
    : route;
}

export function getRouteByKey(key: string): RouteConfig | undefined {
  const routes = ROUTES_CONFIG as unknown as Record<string, RouteConfig>;
  let foundRoute: RouteConfig | undefined = undefined;

  const traverse = (routeList: Record<string, RouteConfig>) => {
    for (const k of Object.keys(routeList)) {
      if (foundRoute) return;
      const r = routeList[k];
      if (r.key === key) {
        foundRoute = r;
        return;
      }
      if (r.children) {
        traverse(r.children as Record<string, RouteConfig>);
      }
    }
  };

  traverse(routes);
  return foundRoute;
}

export function convertRoutesToMenuItems(
  routes: Record<string, RouteConfig>,
): SidebarMenuItem[] {
  const toMenuItem = (
    route: RouteConfig,
    depth: number,
  ): SidebarMenuItem | null => {
    if (route.isShow === false) return null;

    const item: SidebarMenuItem = {
      key: route.key,
      label: route.label,
      translationKey: route.translationKey,
      path: route.path,
      icon: route.icon,
      isShow: route.isShow,
      permission: route.permission,
    };

    if (route.children && depth < 3) {
      const children = Object.keys(route.children)
        .map((childKey) => toMenuItem(route.children![childKey], depth + 1))
        .filter((child): child is SidebarMenuItem => child !== null);
      if (children.length > 0) {
        item.children = children;
      }
    }

    return item;
  };

  const items: SidebarMenuItem[] = [];
  const home = routes["HOME"];
  if (home && home.isShow !== false) {
    items.push({
      key: home.key,
      label: home.label,
      translationKey: home.translationKey,
      path: home.path,
      icon: home.icon,
      isShow: home.isShow,
      permission: home.permission,
    });
  }

  for (const key of Object.keys(routes)) {
    if (key === "HOME") continue;
    const item = toMenuItem(routes[key], 1);
    if (item) items.push(item);
  }
  return items;
}

export function filterMenuByPermission(
  items: SidebarMenuItem[],
  canAccess: (permission?: string) => boolean,
): SidebarMenuItem[] {
  const filterItem = (item: SidebarMenuItem): SidebarMenuItem | null => {
    if (item.permission && !canAccess(item.permission)) {
      return null;
    }

    if (item.children?.length) {
      const children = item.children
        .map((child) => filterItem(child))
        .filter((child): child is SidebarMenuItem => child !== null);
      if (children.length === 0) {
        return null;
      }
      return { ...item, children };
    }

    return item;
  };

  return items
    .map((item) => filterItem(item))
    .filter((item): item is SidebarMenuItem => item !== null);
}

export const DEFAULT_MENUS: SidebarMenuItem[] = convertRoutesToMenuItems(
  ROUTES_CONFIG as unknown as Record<string, RouteConfig>,
);
