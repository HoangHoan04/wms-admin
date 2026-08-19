import { AUTH_ROUTES, ROUTES_CONFIG } from '@/common/constants/routes';
import { useAuthStore } from '@/stores/auth.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useTabsStore } from '@/stores/tabs.store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import type { Router } from 'vue-router';

// Cấu hình NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    // Bắt đầu progress bar khi chuyển route
    NProgress.start();

    const authStore = useAuthStore();
    const loggedIn = authStore.isAuthenticated;

    // Document Title
    const title = (to.meta?.title as string) || 'WMS SMART';
    document.title = `${title} | WMS Smart Enterprise`;

    // Auth Protection
    if (to.meta?.requiresAuth && !loggedIn) {
      next({ path: AUTH_ROUTES.LOGIN, query: { redirect: to.fullPath } });
      return;
    }

    if (to.meta?.guest && loggedIn && to.path.startsWith(AUTH_ROUTES.AUTH)) {
      next({ path: ROUTES_CONFIG.HOME.path });
      return;
    }

    // Sync TabsBar & Sidebar Menu
    if (to.meta?.requiresAuth !== false && !to.path.startsWith(AUTH_ROUTES.AUTH)) {
      const tabsStore = useTabsStore();
      const sidebarStore = useSidebarStore();

      tabsStore.addTab({
        key: to.path,
        title: (to.meta?.title as string) || to.name?.toString() || 'Trang',
        path: to.path,
        icon: (to.meta?.icon as string) || undefined,
      });

      // Find matching key in sidebar
      const matchedKey = (to.meta?.menuKey as string) || (to.name?.toString()) || 'home';
      sidebarStore.setSelectedKeys([matchedKey]);
    }

    next();
  });

  router.afterEach(() => {
    // Hoàn thành progress bar khi route render xong
    NProgress.done();
  });

  router.onError(() => {
    // Đảm bảo tắt progress bar nếu có lỗi xảy ra
    NProgress.done();
  });
}

