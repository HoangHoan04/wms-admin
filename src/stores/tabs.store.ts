import type { TabItem } from "@/types/menu.types";
import { defineStore } from "pinia";
import { ref } from "vue";

const DEFAULT_HOME_TAB: TabItem = {
  key: "/",
  title: "Trang chủ",
  path: "/",
  closable: true,
  pinned: false,
  icon: "DashboardOutlined",
};

const STORAGE_PINNED_KEY = "wms_pinned_tabs";

function getStoredPinnedPaths(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_PINNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useTabsStore = defineStore("tabs", () => {
  const pinnedPaths = ref<string[]>(getStoredPinnedPaths());
  const tabs = ref<TabItem[]>([DEFAULT_HOME_TAB]);
  const activeTabKey = ref<string>("/");
  const refreshingKey = ref<string | null>(null);

  function savePinned() {
    localStorage.setItem(STORAGE_PINNED_KEY, JSON.stringify(pinnedPaths.value));
  }

  function addTab(tab: TabItem) {
    const existingIndex = tabs.value.findIndex((t) => t.path === tab.path);
    const isPinned = pinnedPaths.value.includes(tab.path);

    if (existingIndex === -1) {
      tabs.value.push({
        ...tab,
        pinned: isPinned,
        closable: !isPinned && tab.closable !== false,
      });
    } else {
      tabs.value[existingIndex] = {
        ...tabs.value[existingIndex],
        ...tab,
        pinned: isPinned,
        closable: !isPinned && tab.closable !== false,
      };
    }
    activeTabKey.value = tab.path;
  }

  function togglePinTab(path: string) {
    const isPinned = pinnedPaths.value.includes(path);
    if (isPinned) {
      pinnedPaths.value = pinnedPaths.value.filter((p) => p !== path);
    } else {
      pinnedPaths.value.push(path);
    }
    savePinned();

    const target = tabs.value.find((t) => t.path === path);
    if (target) {
      target.pinned = !isPinned;
      target.closable = isPinned;
    }
  }

  function removeTab(path: string): string | null {
    if (tabs.value.length <= 1) return null; // Don't close if it's the last remaining tab
    const index = tabs.value.findIndex((t) => t.path === path);
    if (index === -1) return null;
    if (tabs.value[index].pinned) return null;

    tabs.value.splice(index, 1);

    if (activeTabKey.value === path) {
      const nextTab =
        tabs.value[index] || tabs.value[index - 1] || DEFAULT_HOME_TAB;
      activeTabKey.value = nextTab.path;
      return nextTab.path;
    }
    return null;
  }

  function closeTabsToLeft(path: string): string | null {
    const index = tabs.value.findIndex((t) => t.path === path);
    if (index === -1) return null;

    tabs.value = tabs.value.filter((t, idx) => idx >= index || t.pinned);
    if (!tabs.value.some((t) => t.path === activeTabKey.value)) {
      activeTabKey.value = path;
      return path;
    }
    return null;
  }

  function closeTabsToRight(path: string): string | null {
    const index = tabs.value.findIndex((t) => t.path === path);
    if (index === -1) return null;

    tabs.value = tabs.value.filter((t, idx) => idx <= index || t.pinned);
    if (!tabs.value.some((t) => t.path === activeTabKey.value)) {
      activeTabKey.value = path;
      return path;
    }
    return null;
  }

  function closeOtherTabs(path: string): string | null {
    tabs.value = tabs.value.filter((t) => t.path === path || t.pinned);
    activeTabKey.value = path;
    return path;
  }

  function closeAllTabs(): string {
    tabs.value = tabs.value.filter((t) => t.pinned);
    if (tabs.value.length === 0) {
      tabs.value = [DEFAULT_HOME_TAB];
      activeTabKey.value = "/";
      return "/";
    }
    const target = tabs.value[0];
    activeTabKey.value = target.path;
    return target.path;
  }

  function duplicateTab(path: string) {
    window.open(path, "_blank");
  }

  function refreshTab(path: string) {
    refreshingKey.value = path;
    setTimeout(() => {
      refreshingKey.value = null;
    }, 300);
  }

  return {
    tabs,
    activeTabKey,
    refreshingKey,
    pinnedPaths,
    addTab,
    removeTab,
    togglePinTab,
    closeTabsToLeft,
    closeTabsToRight,
    closeOtherTabs,
    closeAllTabs,
    duplicateTab,
    refreshTab,
  };
});
