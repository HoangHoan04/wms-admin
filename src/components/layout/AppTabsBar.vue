<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import { useTabsStore } from '@/stores/tabs.store';
import type { TabItem } from '@/types/menu.types';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ClearOutlined,
  CloseOutlined,
  ColumnWidthOutlined,
  CompressOutlined,
  CopyOutlined,
  DashboardOutlined,
  DownOutlined,
  ExpandOutlined,
  FileTextOutlined,
  PushpinFilled,
  PushpinOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tabsStore = useTabsStore();
const dashboardStore = useDashboardStore();

const s = computed(() => dashboardStore.settings);
const tabs = computed(() => tabsStore.tabs);
const activeTabKey = computed(() => tabsStore.activeTabKey);

const isMaximized = ref(false);

function toggleMaximize() {
  isMaximized.value = !isMaximized.value;
  const main = document.querySelector('.admin-layout');
  if (main) {
    main.classList.toggle('tab-content-maximized', isMaximized.value);
  }
}

// Context Menu state
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  tab: null as TabItem | null,
});

function onTabClick(tab: TabItem) {
  tabsStore.activeTabKey = tab.path;
  router.push(tab.path);
}

function onCloseTab(tab: TabItem, e: MouseEvent) {
  e.stopPropagation();
  const nextPath = tabsStore.removeTab(tab.path);
  if (nextPath) {
    router.push(nextPath);
  }
}

function openContextMenu(tab: TabItem, e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  contextMenu.tab = tab;
  contextMenu.x = e.clientX;
  contextMenu.y = e.clientY;
  contextMenu.visible = true;
}

function closeContextMenu() {
  contextMenu.visible = false;
  contextMenu.tab = null;
}

function handleRefresh(tab?: TabItem | null) {
  const target = tab || { path: activeTabKey.value };
  tabsStore.refreshTab(target.path);
  closeContextMenu();
}

function handleTogglePin(tab: TabItem) {
  tabsStore.togglePinTab(tab.path);
  closeContextMenu();
}

function handleDuplicate(tab: TabItem) {
  tabsStore.duplicateTab(tab.path);
  closeContextMenu();
}

function handleCloseCurrent(tab: TabItem) {
  const next = tabsStore.removeTab(tab.path);
  if (next) router.push(next);
  closeContextMenu();
}

function handleCloseLeft(tab: TabItem) {
  const next = tabsStore.closeTabsToLeft(tab.path);
  if (next) router.push(next);
  closeContextMenu();
}

function handleCloseRight(tab: TabItem) {
  const next = tabsStore.closeTabsToRight(tab.path);
  if (next) router.push(next);
  closeContextMenu();
}

function handleCloseOthers(tab: TabItem) {
  const next = tabsStore.closeOtherTabs(tab.path);
  if (next) router.push(next);
  closeContextMenu();
}

function handleCloseAll() {
  const next = tabsStore.closeAllTabs();
  router.push(next);
  closeContextMenu();
}

onMounted(() => {
  window.addEventListener('click', closeContextMenu);
  window.addEventListener('contextmenu', closeContextMenu);
});

onUnmounted(() => {
  window.removeEventListener('click', closeContextMenu);
  window.removeEventListener('contextmenu', closeContextMenu);
});
</script>

<template>
  <div v-if="s.showTabs" class="app-tabs-bar flex items-center justify-between" :class="[`tab-style-${s.tabStyle}`]">
    <!-- Tabs Scroll Container -->
    <div class="tabs-scroll-wrapper flex items-center">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="tab-item flex items-center gap-2 cursor-pointer select-none"
        :class="{ active: activeTabKey === tab.path, pinned: tab.pinned }"
        :title="s.tabStyle === 'icon' ? tab.title : undefined"
        @click="onTabClick(tab)"
        @contextmenu.prevent="openContextMenu(tab, $event)"
      >
        <!-- Icon -->
        <template v-if="s.showTabIcons || s.tabStyle === 'icon'">
          <DashboardOutlined v-if="tab.path === '/'" class="tab-leading-icon" />
          <PushpinFilled v-else-if="tab.pinned" class="tab-leading-icon pin-icon" />
          <FileTextOutlined v-else class="tab-leading-icon" />
        </template>

        <!-- Title -->
        <span v-if="s.tabStyle !== 'icon'" class="tab-title">{{ tab.title }}</span>

        <!-- Close Button -->
        <CloseOutlined
          v-if="tabs.length > 1 && tab.closable && !tab.pinned && s.tabStyle !== 'icon'"
          class="tab-close-icon"
          @click="(e: MouseEvent) => onCloseTab(tab, e)"
        />
      </div>
    </div>

    <!-- Tabs Actions Dropdown (Top right of tabs bar) -->
    <div class="tabs-actions flex items-center gap-1">
      <!-- Maximize Tab button -->
      <div
        v-if="s.showMaximizeTab"
        class="tab-action-btn cursor-pointer flex items-center justify-center"
        :title="isMaximized ? 'Thu nhỏ trang' : 'Phóng to vùng làm việc'"
        @click="toggleMaximize"
      >
        <CompressOutlined v-if="isMaximized" />
        <ExpandOutlined v-else />
      </div>

      <!-- Reload Tab button -->
      <div
        class="tab-action-btn cursor-pointer flex items-center justify-center"
        title="Làm mới tab"
        @click="handleRefresh()"
      >
        <ReloadOutlined />
      </div>

      <!-- More Tab Actions -->
      <a-dropdown trigger="click" placement="bottomRight">
        <div class="tab-action-btn cursor-pointer flex items-center justify-center">
          <DownOutlined />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="refresh" @click="handleRefresh()">
              <ReloadOutlined /> Làm mới trang này
            </a-menu-item>
            <a-menu-item key="close-others" @click="handleCloseOthers({ path: activeTabKey, title: '', key: activeTabKey })">
              <ColumnWidthOutlined /> Đóng các tab khác
            </a-menu-item>
            <a-menu-item key="close-all" danger @click="handleCloseAll">
              <ClearOutlined /> Đóng tất cả tab
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- Custom Right-Click Context Menu -->
    <teleport to="body">
      <div
        v-if="contextMenu.visible && contextMenu.tab"
        class="tab-context-menu"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        @click.stop
      >
        <div class="context-menu-item" @click="handleRefresh(contextMenu.tab)">
          <ReloadOutlined class="menu-icon" />
          <span>Làm mới thẻ</span>
        </div>

        <div
          class="context-menu-item"
          @click="handleTogglePin(contextMenu.tab)"
        >
          <PushpinFilled v-if="contextMenu.tab.pinned" class="menu-icon" />
          <PushpinOutlined v-else class="menu-icon" />
          <span>{{ contextMenu.tab.pinned ? 'Bỏ ghim thẻ' : 'Ghim thẻ' }}</span>
        </div>

        <div class="context-menu-item" @click="handleDuplicate(contextMenu.tab)">
          <CopyOutlined class="menu-icon" />
          <span>Nhân đôi thẻ</span>
        </div>

        <div class="context-menu-divider" />

        <div
          v-if="tabs.length > 1 && contextMenu.tab.closable && !contextMenu.tab.pinned"
          class="context-menu-item"
          @click="handleCloseCurrent(contextMenu.tab)"
        >
          <CloseOutlined class="menu-icon" />
          <span>Đóng thẻ hiện tại</span>
        </div>

        <div class="context-menu-item" @click="handleCloseLeft(contextMenu.tab)">
          <ArrowLeftOutlined class="menu-icon" />
          <span>Đóng các tab bên trái</span>
        </div>

        <div class="context-menu-item" @click="handleCloseRight(contextMenu.tab)">
          <ArrowRightOutlined class="menu-icon" />
          <span>Đóng các tab bên phải</span>
        </div>

        <div class="context-menu-item" @click="handleCloseOthers(contextMenu.tab)">
          <ColumnWidthOutlined class="menu-icon" />
          <span>Đóng các tab khác</span>
        </div>

        <div class="context-menu-divider" />

        <div class="context-menu-item item-danger" @click="handleCloseAll">
          <ClearOutlined class="menu-icon" />
          <span>Đóng tất cả các tab (Về trang chủ)</span>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.app-tabs-bar {
  height: 40px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.tabs-scroll-wrapper {
  flex: 1;
  overflow-x: auto;
  gap: 6px;
  height: 100%;
  align-items: center;
}

.tabs-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 5px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  background: var(--muted);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--primary);
  }

  &.active {
    background: var(--primary-muted);
    color: var(--primary);
    border-color: var(--primary);
    font-weight: 600;
  }
}

.tab-leading-icon {
  font-size: 13px;
}

.pin-icon {
  color: var(--primary);
}

.tab-close-icon {
  font-size: 10px;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    color: #ef4444;
  }
}

.tab-action-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  color: var(--muted-foreground);
  transition: all 0.2s ease;

  &:hover {
    background: var(--muted);
    color: var(--foreground);
  }
}

/* ==========================================================================
   TAB STYLES IMPLEMENTATION (chrome, card, icon, simple)
   ========================================================================== */

/* 1. Chrome Style */
.tab-style-chrome {
  .tab-item {
    border-radius: 8px 8px 0 0;
    border-bottom: none;
    margin-top: 4px;
    height: 34px;

    &.active {
      background: var(--background);
      border: 1px solid var(--border);
      border-bottom: 2px solid var(--background);
      color: var(--primary);
      box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
    }
  }
}

/* 2. Card Style */
.tab-style-card {
  .tab-item {
    border-radius: 6px;
    background: var(--background-elevated, var(--muted));
    border: 1px solid var(--border);

    &.active {
      background: var(--background-card, #fff);
      border-color: var(--primary);
      color: var(--primary);
      box-shadow: var(--shadow-sm);
    }
  }
}

/* 3. Icon Only Style */
.tab-style-icon {
  .tab-item {
    width: 36px;
    height: 30px;
    padding: 0;
    justify-content: center;
    border-radius: var(--radius-md);

    .tab-leading-icon {
      font-size: 15px;
    }
  }
}

/* 4. Simple / Underline Style */
.tab-style-simple {
  .tab-item {
    background: transparent;
    border: none;
    border-radius: 0;
    height: 38px;
    padding: 0 14px;
    border-bottom: 2px solid transparent;

    &.active {
      background: transparent;
      border-bottom-color: var(--primary);
      color: var(--primary);
    }
  }
}

/* Context Menu Styling */
.tab-context-menu {
  position: fixed;
  z-index: 99999;
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  padding: 6px 0;
  min-width: 220px;
  backdrop-filter: blur(8px);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--primary-muted);
    color: var(--primary);
  }

  &.item-danger {
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }

  .menu-icon {
    font-size: 14px;
  }
}

.context-menu-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
</style>
