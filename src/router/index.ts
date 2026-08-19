import {
  AUTH_ROUTES,
  ERROR_ROUTES,
  ROUTES_CONFIG,
} from "@/common/constants/routes";
import { setupRouterGuards } from "@/router/guards";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: AUTH_ROUTES.AUTH,
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      { path: "", redirect: AUTH_ROUTES.LOGIN },
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/LoginPage.vue"),
        meta: {
          guest: true,
          title: "Đăng nhập",
          titleKey: "routes.login",
        },
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("@/views/auth/ForgotPassword.vue"),
        meta: {
          guest: true,
          title: "Quên mật khẩu",
          titleKey: "routes.forgotPassword",
        },
      },
    ],
  },
  {
    path: ROUTES_CONFIG.HOME.path,
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTES_CONFIG.HOME.key,
        component: () => import("@/views/main/home/HomeDashboard.vue"),
        meta: {
          title: "Trang chủ",
          titleKey: ROUTES_CONFIG.HOME.translationKey,
          icon: ROUTES_CONFIG.HOME.icon,
          menuKey: ROUTES_CONFIG.HOME.key,
          permission: ROUTES_CONFIG.HOME.permission,
        },
      },
      {
        path: "warehouse/list",
        name: "warehouse-list",
        component: () => import("@/views/main/warehouse/WarehouseList.vue"),
        meta: {
          title: "Danh sách kho",
          titleKey: "routes.companyList",
          menuKey: "COMPANY_MANAGER",
        },
      },
      {
        path: "warehouse/locations",
        name: "warehouse-locations",
        component: () => import("@/views/other/ComingSoon.vue"),
        meta: {
          title: "Sơ đồ vị trí kệ",
          titleKey: "routes.orgChart",
          menuKey: "ORG_CHART",
        },
      },
      {
        path: "inventory/list",
        name: "inventory-list",
        component: () => import("@/views/main/inventory/InventoryList.vue"),
        meta: {
          title: "Tra cứu tồn kho",
          titleKey: "routes.partList",
          menuKey: "PART_MANAGER",
        },
      },
      {
        path: "inventory/inbound",
        name: "inventory-inbound",
        component: () => import("@/views/other/ComingSoon.vue"),
        meta: {
          title: "Quản lý nhập kho",
          titleKey: "routes.punchImport",
          menuKey: "PUNCH_IMPORT",
        },
      },
      {
        path: "inventory/outbound",
        name: "inventory-outbound",
        component: () => import("@/views/other/ComingSoon.vue"),
        meta: {
          title: "Quản lý xuất kho",
          titleKey: "routes.payrollExports",
          menuKey: "PAYROLL_EXPORTS",
        },
      },
      {
        path: "system/settings",
        name: "system-settings",
        component: () => import("@/views/main/system/SystemSettings.vue"),
        meta: {
          title: "Cấu hình hệ thống",
          titleKey: ROUTES_CONFIG.SETTING_SYSTEM.translationKey,
          menuKey: ROUTES_CONFIG.SETTING_SYSTEM.key,
          permission: ROUTES_CONFIG.SETTING_SYSTEM.permission,
        },
      },
      {
        path: "system/roles",
        name: "system-roles",
        component: () => import("@/views/main/system/RoleManager.vue"),
        meta: {
          title: "Phân quyền vai trò",
          titleKey: ROUTES_CONFIG.ROLE_MANAGER.translationKey,
          menuKey: ROUTES_CONFIG.ROLE_MANAGER.key,
          permission: ROUTES_CONFIG.ROLE_MANAGER.permission,
        },
      },
    ],
  },
  {
    path: ERROR_ROUTES.SERVER_ERROR,
    name: "server-error",
    component: () => import("@/views/other/ServerError.vue"),
    meta: {
      title: "Lỗi máy chủ",
      titleKey: "routes.serverError",
    },
  },
  {
    path: ERROR_ROUTES.NOT_FOUND,
    name: "not-found",
    component: () => import("@/views/other/NotFound.vue"),
    meta: {
      title: "Không tìm thấy trang",
      titleKey: "routes.notFound",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: "smooth" };
  },
});

/**
 * Xử lý lỗi tải Chunk (ChunkLoadError) khi deploy phiên bản mới lên Production
 */
router.onError((error, to) => {
  const isChunkLoadFailed =
    /Loading chunk (\d)+ failed/i.test(error.message) ||
    /Failed to fetch dynamically imported module/i.test(error.message) ||
    /Importing a module script failed/i.test(error.message);

  if (isChunkLoadFailed && to?.fullPath) {
    const reloadKey = `chunk_reload_${to.fullPath}`;
    const hasReloaded = sessionStorage.getItem(reloadKey);

    if (!hasReloaded) {
      sessionStorage.setItem(reloadKey, "true");
      window.location.href = to.fullPath;
      return;
    }
  }

  console.error("[Router Error]", error);
});

setupRouterGuards(router);

export default router;
