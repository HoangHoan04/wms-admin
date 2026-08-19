import { DEFAULT_MENUS, type SidebarMenuItem } from "@/common/constants/routes";
import { useDashboardStore } from "@/stores/dashboard.store";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export { DEFAULT_MENUS };

export const useSidebarStore = defineStore("sidebar", () => {
  const dashboardStore = useDashboardStore();
  const menus = ref<SidebarMenuItem[]>(DEFAULT_MENUS);
  const selectedKeys = ref<string[]>(["HOME"]);
  const openKeys = ref<string[]>([""]);

  const collapsed = computed({
    get: () => dashboardStore.settings.collapseSidebar,
    set: (val: boolean) => {
      dashboardStore.updateSettings({ collapseSidebar: val });
    },
  });

  function toggleCollapse() {
    dashboardStore.updateSettings({
      collapseSidebar: !dashboardStore.settings.collapseSidebar,
    });
  }

  function setCollapsed(val: boolean) {
    dashboardStore.updateSettings({ collapseSidebar: val });
  }

  function setSelectedKeys(keys: string[]) {
    selectedKeys.value = keys;
  }

  function setOpenKeys(keys: string[]) {
    openKeys.value = keys;
  }

  return {
    collapsed,
    menus,
    selectedKeys,
    openKeys,
    toggleCollapse,
    setCollapsed,
    setSelectedKeys,
    setOpenKeys,
  };
});
