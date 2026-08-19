<script setup lang="ts">
import type { SidebarMenuItem } from '@/common/constants/routes';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useTabsStore } from '@/stores/tabs.store';
import * as Icons from '@ant-design/icons-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();

const sidebarStore = useSidebarStore();
const dashboardStore = useDashboardStore();
const tabsStore = useTabsStore();

const s = computed(() => dashboardStore.settings);
const collapsed = computed(() => sidebarStore.collapsed);

function getIconComponent(iconName?: string) {
  if (!iconName) return Icons.AppstoreOutlined;
  if ((Icons as any)[iconName]) return (Icons as any)[iconName];
  const pascalName =
    iconName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Outlined';
  if ((Icons as any)[pascalName]) return (Icons as any)[pascalName];
  return Icons.AppstoreOutlined;
}

function getMenuTitle(item: any) {
  if (item.translationKey) {
    const translated = t(item.translationKey);
    if (translated && translated !== item.translationKey) return translated;
  }
  if (item.titleKey) {
    const translated = t(item.titleKey);
    if (translated && translated !== item.titleKey) return translated;
  }
  return item.label || item.defaultTitle || item.key || '';
}

function onMenuClick(item: SidebarMenuItem | any) {
  if (item.path) {
    sidebarStore.setSelectedKeys([item.key]);
    tabsStore.addTab({
      key: item.path,
      title: getMenuTitle(item),
      path: item.path,
      icon: item.icon,
    });
    router.push(item.path);
  }
}

function onOpenChange(openKeys: any[]) {
  const keys = openKeys as string[];
  if (!s.value.accordionMenu) {
    sidebarStore.setOpenKeys(keys);
    return;
  }
  const latestOpenKey = keys.find((key) => !sidebarStore.openKeys.includes(key));
  if (!latestOpenKey) {
    sidebarStore.setOpenKeys([]);
  } else {
    sidebarStore.setOpenKeys([latestOpenKey]);
  }
}
</script>

<template>
  <a-layout-sider
    v-if="s.showSidebar"
    v-model:collapsed="sidebarStore.collapsed"
    :trigger="null"
    collapsible
    :width="s.sidebarWidth || 250"
    :collapsed-width="s.sidebarCollapsedWidth || 72"
    class="app-sidebar"
    :style="{
      background: dashboardStore.isDarkMode ? s.sidebarColorDark : s.sidebarColorLight,
      borderRight: s.sidebarPosition === 'left' ? '1px solid var(--border)' : 'none',
      borderLeft: s.sidebarPosition === 'right' ? '1px solid var(--border)' : 'none',
    }"
  >
    <!-- Brand Logo Header -->
    <div class="sidebar-logo flex items-center justify-center">
      <div class="logo-wrap flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <div class="logo-box flex items-center justify-center">W</div>
        <div v-if="!collapsed" class="logo-text">
          <span class="brand-title">WMS SMART</span>
          <span class="brand-sub">Enterprise</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="sidebar-menu-wrap">
      <a-menu
        mode="inline"
        :selected-keys="sidebarStore.selectedKeys"
        :open-keys="sidebarStore.openKeys"
        @open-change="onOpenChange"
      >
        <template v-for="item in sidebarStore.menus" :key="item.key">
          <!-- Submenu branch (Level 1) -->
          <a-sub-menu
            v-if="item.children && item.children.length > 0"
            :key="`submenu-1-${item.key}`"
          >
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            <template #title>{{ getMenuTitle(item) }}</template>

            <!-- Submenu Level 2 -->
            <template v-for="sub in item.children" :key="sub.key">
              <a-sub-menu
                v-if="sub.children && sub.children.length > 0"
                :key="`submenu-2-${sub.key}`"
              >
                <template #icon>
                  <component :is="getIconComponent(sub.icon)" />
                </template>
                <template #title>{{ getMenuTitle(sub) }}</template>

                <!-- Submenu Level 3 items -->
                <a-menu-item
                  v-for="subChild in sub.children"
                  :key="`item-3-${subChild.key}`"
                  @click="onMenuClick(subChild)"
                >
                  {{ getMenuTitle(subChild) }}
                </a-menu-item>
              </a-sub-menu>

              <!-- Single item in Level 2 -->
              <a-menu-item
                v-else
                :key="`item-2-${sub.key}`"
                @click="onMenuClick(sub)"
              >
                <template #icon>
                  <component :is="getIconComponent(sub.icon)" />
                </template>
                {{ getMenuTitle(sub) }}
              </a-menu-item>
            </template>
          </a-sub-menu>

          <!-- Single Item branch (Level 1) -->
          <a-menu-item
            v-else
            :key="`item-1-${item.key}`"
            @click="onMenuClick(item)"
          >
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            <span>{{ getMenuTitle(item) }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<style scoped>
.app-sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
  box-shadow: var(--shadow-sm);
}

.sidebar-logo {
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
}

.logo-wrap {
  width: 100%;
  justify-content: flex-start;
}

.logo-box {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
}
.brand-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--foreground);
  white-space: nowrap;
}
.brand-sub {
  font-size: 10px;
  color: var(--primary);
  font-weight: 600;
  text-transform: uppercase;
}

.sidebar-menu-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
</style>
