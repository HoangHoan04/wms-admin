<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import AppNavbar from '@/components/layout/AppNavbar.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppTabsBar from '@/components/layout/AppTabsBar.vue';
import ConfigSettingDrawer from '@/components/layout/ConfigSettingDrawer.vue';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useTabsStore } from '@/stores/tabs.store';
import { computed } from 'vue';

const dashboardStore = useDashboardStore();
const tabsStore = useTabsStore();

const s = computed(() => dashboardStore.settings);
</script>

<template>
  <a-layout
    class="admin-layout"
    :class="[
      `layout-${s.layoutMode.replace(/\s+/g, '-')}`,
      `sidebar-pos-${s.sidebarPosition}`,
    ]"
  >
    <!-- Sidebar (v-if="s.showSidebar") -->
    <AppSidebar v-if="s.showSidebar" />

    <a-layout class="admin-main-wrapper">
      <!-- Navbar (includes Breadcrumb on left) -->
      <AppNavbar />

      <!-- Tabs Bar -->
      <AppTabsBar v-if="s.showTabs" />

      <!-- Watermark wrapper -->
      <a-watermark
        :content="s.watermark ? s.watermarkText : ''"
        :gap="[120, 120]"
        class="watermark-container"
      >
        <!-- Main Page Content -->
        <a-layout-content class="admin-content">
          <router-view v-slot="{ Component, route }">
            <transition :name="s.transitionEffect" mode="out-in">
              <component
                :is="Component"
                v-if="tabsStore.refreshingKey !== route.path"
                :key="route.fullPath"
              />
            </transition>
          </router-view>
        </a-layout-content>
      </a-watermark>

      <!-- Footer (v-if="s.showFooter") -->
      <AppFooter v-if="s.showFooter" />
    </a-layout>

    <!-- Back to Top Button -->
    <a-back-top v-if="s.backToTop" :visibility-height="120" />

    <!-- Global Config Setting Drawer & Draggable Floating Action Button -->
    <ConfigSettingDrawer />
  </a-layout>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: row;
}

/* Sidebar Position Right */
.admin-layout.sidebar-pos-right {
  flex-direction: row-reverse;
}

.admin-main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  background: var(--background);
  transition: all 0.2s ease;
  overflow-x: hidden;
}

.watermark-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  padding: 20px 24px;
  background: var(--background);
  min-height: 280px;
}
</style>
