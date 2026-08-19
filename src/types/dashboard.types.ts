export type Language = "vi" | "en";
export type ThemeMode = "light" | "dark" | "system";
export type LayoutMode =
  | "horizontal"
  | "detached"
  | "modern"
  | "two column"
  | "hovered"
  | "boxed"
  | "horizontal single"
  | "horizontal overlay"
  | "horizontal box"
  | "menu aside"
  | "transparent"
  | "without header"
  | "RTL";
export type TransitionEffect =
  | "fade"
  | "fade-side"
  | "fade-up"
  | "fade-down"
  | "fade-zoom"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "rotate"
  | "flip-x"
  | "flip-y"
  | "bounce"
  | "slide-up"
  | "slide-down";
export type TabStyle = "chrome" | "card" | "icon" | "simple";
export type ColorType = "solid" | "gradient";

export interface DashboardSettings {
  language: Language;
  dynamicTitle: boolean;
  backToTop: boolean;
  watermark: boolean;
  watermarkText: string;
  theme: ThemeMode;
  colorBlind: boolean;
  grayscale: boolean;
  borderRadius: number;
  fontFamily: string;
  fontWeight: "light" | "normal" | "medium" | "semibold";
  titleSize: number;
  bodySize: number;
  boldText: boolean;
  italicText: boolean;
  uppercaseText: boolean;
  primaryColor: string;
  navbarColorType: ColorType;
  navbarColorLight: string;
  navbarColorDark: string;
  sidebarColorType: ColorType;
  sidebarColorLight: string;
  sidebarColorDark: string;
  layoutMode: LayoutMode;
  sidebarPosition: "left" | "right" | "top";
  configPosition: "left" | "right";
  showSidebar: boolean;
  collapseSidebar: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  accordionMenu: boolean;
  showTabs: boolean;
  persistTabs: boolean;
  dragTabs: boolean;
  showTabIcons: boolean;
  showMaximizeTab: boolean;
  showBreadcrumb: boolean;
  tabStyle: TabStyle;
  maxTabs: number;
  pageProgress: boolean;
  pageLoader: boolean;
  pageTransition: boolean;
  transitionEffect: TransitionEffect;
  showFooter: boolean;
  fixedFooter: boolean;
  companyName: string;
  companyWebsite: string;
  copyrightYear: string;
  icpNumber: string;
  icpLink: string;
}
