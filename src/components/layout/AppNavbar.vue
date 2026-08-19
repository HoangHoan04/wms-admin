<script setup lang="ts">
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue';
import FullscreenToggle from '@/components/layout/FullscreenToggle.vue';
import LanguageSelect from '@/components/layout/LanguageSelect.vue';
import NavbarNotification from '@/components/layout/NavbarNotification.vue';
import SearchBox from '@/components/layout/SearchBox.vue';
import ThemeToggle from '@/components/layout/ThemeToggle.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();
const dashboardStore = useDashboardStore();

const s = computed(() => dashboardStore.settings);
const user = computed(() => authStore.user);
const collapsed = computed(() => sidebarStore.collapsed);

function onLogout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>

<template>
  <a-layout-header
    class="app-navbar flex items-center justify-between"
    :style="{
      background: dashboardStore.isDarkMode ? s.navbarColorDark : s.navbarColorLight,
      borderBottom: '1px solid var(--border)',
    }"
  >
    <!-- Left Section: Sidebar Toggle + Breadcrumb -->
    <div class="navbar-left flex items-center gap-3">
      <div
        v-if="s.showSidebar"
        class="sidebar-toggle-btn cursor-pointer flex items-center justify-center"
        title="Thu gọn / Mở rộng Menu"
        @click="sidebarStore.toggleCollapse"
      >
        <MenuUnfoldOutlined v-if="collapsed" class="toggle-icon" />
        <MenuFoldOutlined v-else class="toggle-icon" />
      </div>

      <!-- Breadcrumb inside navbar left -->
      <AppBreadcrumb />
    </div>

    <!-- Right Section Actions: Search, Fullscreen, Language, Theme, Notifications, User -->
    <div class="navbar-right flex items-center gap-2">
      <!-- Search -->
      <SearchBox />

      <!-- Fullscreen -->
      <FullscreenToggle />

      <!-- Language Selector -->
      <LanguageSelect />

      <!-- Theme Mode (Light / Dark) -->
      <ThemeToggle />

      <!-- Notifications -->
      <NavbarNotification />

      <!-- User Dropdown -->
      <a-dropdown trigger="click" placement="bottomRight">
        <div class="user-profile-trigger flex items-center gap-2 cursor-pointer">
          <a-avatar
            :size="34"
            style="background-color: var(--primary); font-weight: 600"
          >
            {{ user?.fullName?.charAt(0) || 'A' }}
          </a-avatar>
        </div>

        <template #overlay>
          <a-menu style="min-width: 180px">
            <div class="dropdown-header">
              <div class="font-bold">{{ user?.fullName }}</div>
              <div class="text-xs text-muted-foreground">{{ user?.email }}</div>
            </div>
            <a-menu-divider />
            <a-menu-item key="settings" @click="router.push('/system/settings')">
              <SettingOutlined /> Cài đặt tài khoản
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" danger @click="onLogout">
              <LogoutOutlined /> Đăng xuất
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<style scoped lang="scss">
.app-navbar {
  height: 56px !important;
  line-height: normal !important;
  padding: 0 16px !important;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: normal !important;
  height: 100%;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: normal !important;
  height: 100%;
}

.sidebar-toggle-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  color: var(--foreground);
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    background: var(--muted);
    color: var(--primary);
  }

  .toggle-icon {
    font-size: 16px;
  }
}

.user-profile-trigger {
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: background 0.2s ease;
  line-height: 1.2;

  &:hover {
    background: var(--muted);
  }
}

.dropdown-header {
  padding: 8px 12px;
}
</style>
