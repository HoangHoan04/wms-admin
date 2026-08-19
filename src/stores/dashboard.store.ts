import type {
  DashboardSettings,
  LayoutMode,
  TabStyle,
  ThemeMode,
  TransitionEffect,
} from "@/types/dashboard.types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const STORAGE_KEY = "wms_dashboard_settings";
export const PRIMARY_COLORS = [
  { name: "blue", value: "#3b82f6" },
  { name: "red", value: "#ef4444" },
  { name: "yellow", value: "#f59e0b" },
  { name: "brown", value: "#78350f" },
  { name: "purple", value: "#8b5cf6" },
  { name: "pink", value: "#ec4899" },
  { name: "orange", value: "#f97316" },
  { name: "emerald", value: "#10b981" },
  { name: "teal", value: "#14b8a6" },
  { name: "indigo", value: "#6366f1" },
];
export const SOLID_COLORS = [
  "#ffffff",
  "#f8fafc",
  "#f0fdf4",
  "#eff6ff",
  "#fdf2f8",
  "#faf5ff",
  "#fffbeb",
  "#f0f9ff",
  "#8f0b0b",
  "#f5f5f4",
];
export const SOLID_COLORS_DARK = [
  "#000000",
  "#1e1e2e",
  "#18181b",
  "#0f172a",
  "#1a1a2e",
  "#16213e",
  "#0d1117",
  "#111827",
  "#1f2937",
  "#27272a",
];
export const GRADIENT_COLORS = [
  "linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)",
  "linear-gradient(135deg,#e0c3fc 0%,#8ec5fc 100%)",
  "linear-gradient(135deg,#fdfbfb 0%,#ebedee 100%)",
  "linear-gradient(135deg,#f6d365 0%,#fda085 100%)",
  "linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)",
  "linear-gradient(135deg,#d4fc79 0%,#96e6a1 100%)",
  "linear-gradient(135deg,#ff9a9e 0%,#fecfef 100%)",
  "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)",
  "linear-gradient(135deg,#e0f2fe 0%,#bae6fd 100%)",
  "linear-gradient(135deg,#fae8ff 0%,#f5d0fe 100%)",
];
export const GRADIENT_COLORS_DARK = [
  "linear-gradient(135deg,#1c1c1c 0%,#2d2d2d 100%)",
  "linear-gradient(135deg,#0f0c29 0%,#302b63 100%)",
  "linear-gradient(135deg,#141e30 0%,#243b55 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
  "linear-gradient(135deg,#0d0d0d 0%,#1a0533 100%)",
  "linear-gradient(135deg,#0f2027 0%,#203a43 100%)",
  "linear-gradient(135deg,#1f1c2c 0%,#928dab 100%)",
  "linear-gradient(135deg,#16222a 0%,#3a6073 100%)",
  "linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)",
  "linear-gradient(135deg,#2c3e50 0%,#4ca1af 100%)",
];
export const LAYOUT_MODES: { value: LayoutMode; labelKey: string }[] = [
  { value: "horizontal", labelKey: "configSetting.layout.horizontal" },
  { value: "detached", labelKey: "configSetting.layout.detached" },
  { value: "modern", labelKey: "configSetting.layout.modern" },
  { value: "two column", labelKey: "configSetting.layout.twoColumn" },
  { value: "hovered", labelKey: "configSetting.layout.hovered" },
  { value: "boxed", labelKey: "configSetting.layout.boxed" },
  {
    value: "horizontal single",
    labelKey: "configSetting.layout.horizontalSingle",
  },
  {
    value: "horizontal overlay",
    labelKey: "configSetting.layout.horizontalOverlay",
  },
  { value: "horizontal box", labelKey: "configSetting.layout.horizontalBox" },
  { value: "menu aside", labelKey: "configSetting.layout.menuAside" },
  { value: "transparent", labelKey: "configSetting.layout.transparent" },
  { value: "without header", labelKey: "configSetting.layout.withoutHeader" },
  { value: "RTL", labelKey: "configSetting.layout.rtl" },
];
export const TRANSITION_EFFECTS: {
  value: TransitionEffect;
  labelKey: string;
}[] = [
  { value: "fade", labelKey: "configSetting.transition.fade" },
  { value: "fade-side", labelKey: "configSetting.transition.fadeSide" },
  { value: "fade-up", labelKey: "configSetting.transition.fadeUp" },
  { value: "fade-down", labelKey: "configSetting.transition.fadeDown" },
  { value: "fade-zoom", labelKey: "configSetting.transition.fadeZoom" },
  { value: "slide-left", labelKey: "configSetting.transition.slideLeft" },
  { value: "slide-right", labelKey: "configSetting.transition.slideRight" },
  { value: "zoom-in", labelKey: "configSetting.transition.zoomIn" },
  { value: "zoom-out", labelKey: "configSetting.transition.zoomOut" },
  { value: "rotate", labelKey: "configSetting.transition.rotate" },
  { value: "flip-x", labelKey: "configSetting.transition.flipX" },
  { value: "flip-y", labelKey: "configSetting.transition.flipY" },
  { value: "bounce", labelKey: "configSetting.transition.bounce" },
  { value: "slide-up", labelKey: "configSetting.transition.slideUp" },
  { value: "slide-down", labelKey: "configSetting.transition.slideDown" },
];
export const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Outfit",
];
export const TAB_STYLES: { value: TabStyle; labelKey: string }[] = [
  { value: "chrome", labelKey: "configSetting.tabStyleChrome" },
  { value: "card", labelKey: "configSetting.tabStyleCard" },
  { value: "icon", labelKey: "configSetting.tabStyleIcon" },
  { value: "simple", labelKey: "configSetting.tabStyleSimple" },
];

export const DEFAULT_SETTINGS: DashboardSettings = {
  language: "vi",
  dynamicTitle: true,
  backToTop: true,
  watermark: false,
  watermarkText: "WMS SMART ENTERPRISE",
  theme: "light",
  colorBlind: false,
  grayscale: false,
  borderRadius: 8,
  fontFamily: "Inter",
  fontWeight: "normal",
  titleSize: 18,
  bodySize: 14,
  boldText: false,
  italicText: false,
  uppercaseText: false,
  primaryColor: "#3b82f6",
  navbarColorType: "solid",
  navbarColorLight: "#ffffff",
  navbarColorDark: "#0c0c0c",
  sidebarColorType: "solid",
  sidebarColorLight: "#ffffff",
  sidebarColorDark: "#000000",
  layoutMode: "modern",
  sidebarPosition: "left",
  configPosition: "right",
  showSidebar: true,
  collapseSidebar: false,
  sidebarWidth: 250,
  sidebarCollapsedWidth: 72,
  accordionMenu: true,
  showTabs: true,
  persistTabs: true,
  dragTabs: true,
  showTabIcons: true,
  showMaximizeTab: true,
  showBreadcrumb: true,
  tabStyle: "chrome",
  maxTabs: 10,
  pageProgress: true,
  pageLoader: false,
  pageTransition: true,
  transitionEffect: "fade-side",
  showFooter: true,
  fixedFooter: false,
  companyName: "WMS Smart Enterprise",
  companyWebsite: "https://wms-smart.vn",
  copyrightYear: "2026",
  icpNumber: "ICP-VN-20260819",
  icpLink: "https://wms-smart.vn",
};

const load = (): DashboardSettings => {
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const rgba = (h: string, a: number) => {
  const x = h.replace("#", "");
  if (x.length !== 6) return `rgba(59,130,246,${a})`;
  return `rgba(${parseInt(x.slice(0, 2), 16)},${parseInt(x.slice(2, 4), 16)},${parseInt(x.slice(4), 16)},${a})`;
};

export const useDashboardStore = defineStore("dashboard", () => {
  const settings = ref<DashboardSettings>(load());
  const configDrawerVisible = ref(false);

  const isDarkMode = computed(
    () =>
      settings.value.theme === "dark" ||
      (settings.value.theme === "system" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  const antdTheme = computed(() => ({
    token: {
      colorPrimary: settings.value.primaryColor,
      borderRadius: settings.value.borderRadius,
      fontFamily: settings.value.fontFamily,
    },
  }));

  function applyDomEffects() {
    const s = settings.value,
      r = document.documentElement,
      b = document.body,
      d = isDarkMode.value;

    r.classList.toggle("dark", d);
    r.dataset.layout = s.layoutMode;
    r.dataset.sidebarPosition = s.sidebarPosition;
    r.dataset.configPosition = s.configPosition;
    r.style.filter = s.grayscale
      ? "grayscale(100%)"
      : s.colorBlind
        ? "contrast(120%) saturate(130%) sepia(20%)"
        : "";

    const vars: { [k: string]: string } = {
      "--primary": s.primaryColor,
      "--color-primary": s.primaryColor,
      "--primary-muted": rgba(s.primaryColor, d ? 0.18 : 0.12),
      "--ring": rgba(s.primaryColor, 0.4),
      "--radius": `${s.borderRadius}px`,
      "--sidebar-width": `${s.sidebarWidth}px`,
      "--sidebar-collapsed-width": `${s.sidebarCollapsedWidth}px`,
      "--font-family": s.fontFamily,
      "--title-size": `${s.titleSize}px`,
      "--body-size": `${s.bodySize}px`,
      "--navbar-bg": d ? s.navbarColorDark : s.navbarColorLight,
      "--sidebar-bg": d ? s.sidebarColorDark : s.sidebarColorLight,
    };
    Object.entries(vars).forEach(([k, v]) => r.style.setProperty(k, v));

    const weights: Record<string, string> = {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
    };
    [r, b].forEach((x) => {
      x.style.fontFamily = s.fontFamily;
      x.style.fontSize = `${s.bodySize}px`;
      x.style.fontWeight = s.boldText ? "700" : weights[s.fontWeight] || "400";
      x.style.fontStyle = s.italicText ? "italic" : "normal";
    });

    (
      [
        "showFooter",
        "fixedFooter",
        "showSidebar",
        "collapseSidebar",
        "showTabs",
        "watermark",
      ] as const
    ).forEach((k) =>
      r.classList.toggle(
        `s-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
        s[k],
      ),
    );
    r.classList.toggle("s-uppercase", s.uppercaseText);
  }

  function updateSettings(p: Partial<DashboardSettings>) {
    settings.value = { ...settings.value, ...p };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
    applyDomEffects();
  }

  function resetSettings() {
    settings.value = { ...DEFAULT_SETTINGS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
    applyDomEffects();
  }

  function toggleConfigDrawer(v?: boolean) {
    configDrawerVisible.value = v ?? !configDrawerVisible.value;
  }

  function toggleThemeMode() {
    const nextMode: ThemeMode = isDarkMode.value ? "light" : "dark";
    updateSettings({ theme: nextMode });
  }

  applyDomEffects();

  return {
    settings,
    configDrawerVisible,
    isDarkMode,
    antdTheme,
    updateSettings,
    resetSettings,
    toggleConfigDrawer,
    toggleThemeMode,
    applyDomEffects,
  };
});
