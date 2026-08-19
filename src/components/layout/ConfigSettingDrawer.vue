<script setup lang="ts">
import { setI18nLanguage } from '@/plugins/i18n';
import {
  FONT_FAMILIES,
  GRADIENT_COLORS,
  GRADIENT_COLORS_DARK,
  LAYOUT_MODES,
  PRIMARY_COLORS,
  SOLID_COLORS,
  SOLID_COLORS_DARK,
  TAB_STYLES,
  TRANSITION_EFFECTS,
  useDashboardStore,
} from '@/stores/dashboard.store';
import type { DashboardSettings } from '@/types/dashboard.types';
import {
  CopyOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useDashboardStore();
const s = computed(() => store.settings);
const modes = ['light', 'dark'] as const;

// Draggable Floating Button state
const floatTop = ref<number>(
  (() => {
    const saved = localStorage.getItem('wms_config_float_top');
    return saved ? Number(saved) : 320;
  })(),
);

let isDragging = false;
let startY = 0;
let startTop = 0;

function onFloatPointerDown(e: PointerEvent) {
  isDragging = false;
  startY = e.clientY;
  startTop = floatTop.value;

  window.addEventListener('pointermove', onFloatPointerMove);
  window.addEventListener('pointerup', onFloatPointerUp);
}

function onFloatPointerMove(e: PointerEvent) {
  const deltaY = e.clientY - startY;
  if (Math.abs(deltaY) > 3) {
    isDragging = true;
  }

  const minTop = 64;
  const maxTop = window.innerHeight - 60;
  let newTop = startTop + deltaY;
  if (newTop < minTop) newTop = minTop;
  if (newTop > maxTop) newTop = maxTop;

  floatTop.value = newTop;
}

function onFloatPointerUp() {
  window.removeEventListener('pointermove', onFloatPointerMove);
  window.removeEventListener('pointerup', onFloatPointerUp);

  if (isDragging) {
    localStorage.setItem('wms_config_float_top', String(floatTop.value));
  } else {
    store.toggleConfigDrawer(true);
  }
  isDragging = false;
}

const update = async (partial: Partial<DashboardSettings>) => {
  if (partial.language) {
    await setI18nLanguage(partial.language);
  }
  store.updateSettings(partial);
};

const palette = (kind: 'navbar' | 'sidebar', mode: 'light' | 'dark') => {
  const type = kind === 'navbar' ? s.value.navbarColorType : s.value.sidebarColorType;
  return type === 'solid'
    ? mode === 'light'
      ? SOLID_COLORS
      : SOLID_COLORS_DARK
    : mode === 'light'
      ? GRADIENT_COLORS
      : GRADIENT_COLORS_DARK;
};

const selectedColor = (kind: 'navbar' | 'sidebar', mode: 'light' | 'dark') =>
  s.value[`${kind}Color${mode === 'light' ? 'Light' : 'Dark'}` as keyof DashboardSettings];

const chooseColor = (kind: 'navbar' | 'sidebar', mode: 'light' | 'dark', color: string) =>
  update({ [`${kind}Color${mode === 'light' ? 'Light' : 'Dark'}`]: color });

async function copyConfig() {
  await navigator.clipboard.writeText(JSON.stringify(s.value, null, 2));
  message.success(t('configSetting.copiedMessage', 'Đã sao chép cấu hình vào Clipboard'));
}

async function reset() {
  store.resetSettings();
  await setI18nLanguage(s.value.language);
  message.success(t('configSetting.resetSuccess', 'Đã đặt lại cấu hình mặc định'));
}

function clearCacheAndLogout() {
  localStorage.clear();
  window.location.assign('/auth/login');
}

onUnmounted(() => {
  window.removeEventListener('pointermove', onFloatPointerMove);
  window.removeEventListener('pointerup', onFloatPointerUp);
});
</script>

<template>
  <div>
    <!-- Draggable Floating Gear Button -->
    <div
      class="config-float-btn cursor-pointer flex items-center justify-center select-none"
      :style="{
        top: `${floatTop}px`,
        left: s.configPosition === 'left' ? '0' : 'auto',
        right: s.configPosition === 'right' ? '0' : 'auto',
        borderRadius: s.configPosition === 'left' ? '0 10px 10px 0' : '10px 0 0 10px',
      }"
      title="Kéo lên / xuống hoặc bấm để mở Tùy biến giao diện"
      @pointerdown="onFloatPointerDown"
    >
      <SettingOutlined class="config-spin-icon" />
    </div>

    <!-- Drawer -->
    <a-drawer
      :open="store.configDrawerVisible"
      :placement="s.configPosition"
      :width="460"
      :closable="false"
      :mask-closable="true"
      root-class-name="config-setting-drawer"
      @close="store.toggleConfigDrawer(false)"
      @update:open="store.toggleConfigDrawer($event)"
    >
      <div class="config-drawer">
        <header class="config-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <SettingOutlined class="config-header-icon" />
            <span class="font-bold text-base">{{ t('configSetting.title', 'Tùy chỉnh hệ thống') }}</span>
          </div>
          <a-button type="text" shape="circle" @click="store.toggleConfigDrawer(false)">
            ✕
          </a-button>
        </header>

        <main class="config-body">
          <!-- General -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.general', 'Cài đặt chung') }}</h4>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.language', 'Ngôn ngữ') }}</span>
              <a-select :value="s.language" class="control" @change="update({ language: $event })">
                <a-select-option value="vi">{{ t('table.languageVi', 'Tiếng Việt') }}</a-select-option>
                <a-select-option value="en">{{ t('table.languageEn', 'English') }}</a-select-option>
              </a-select>
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.dynamicTitle', 'Tiêu đề động') }}</span>
              <a-switch :checked="s.dynamicTitle" @change="update({ dynamicTitle: $event as boolean })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.backToTop', 'Nút lên đầu trang') }}</span>
              <a-switch :checked="s.backToTop" @change="update({ backToTop: $event as boolean })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.watermark', 'Watermark bản quyền') }}</span>
              <a-switch :checked="s.watermark" @change="update({ watermark: $event as boolean })" />
            </div>
            <div v-if="s.watermark" class="config-sub">
              <span class="config-label config-label--sub">{{ t('configSetting.watermarkText', 'Nội dung Watermark') }}</span>
              <a-input :value="s.watermarkText" @update:value="update({ watermarkText: $event })" />
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Interface -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.interface', 'Giao diện & Màu sắc') }}</h4>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.theme', 'Chế độ giao diện') }}</span>
              <a-select :value="s.theme" class="control" @change="update({ theme: $event })">
                <a-select-option value="light">{{ t('configSetting.themeLight', 'Sáng') }}</a-select-option>
                <a-select-option value="dark">{{ t('configSetting.themeDark', 'Tối') }}</a-select-option>
                <a-select-option value="system">{{ t('configSetting.themeSystem', 'Hệ thống') }}</a-select-option>
              </a-select>
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.colorBlind', 'Chế độ mù màu') }}</span>
              <a-switch :checked="s.colorBlind" @change="update({ colorBlind: $event as boolean })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.grayscale', 'Chế độ xám') }}</span>
              <a-switch :checked="s.grayscale" @change="update({ grayscale: $event as boolean })" />
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.borderRadius', 'Bo góc') }} ({{ s.borderRadius }}px)</span>
              <a-slider :value="s.borderRadius" :min="0" :max="24" :step="2" @change="update({ borderRadius: $event as number })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.fontFamily', 'Font chữ') }}</span>
              <a-select :value="s.fontFamily" class="control" @change="update({ fontFamily: $event })">
                <a-select-option v-for="f in FONT_FAMILIES" :key="f" :value="f">{{ f }}</a-select-option>
              </a-select>
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.fontWeight', 'Độ đậm font') }}</span>
              <a-select :value="s.fontWeight" class="control" @change="update({ fontWeight: $event })">
                <a-select-option v-for="x in ['light', 'normal', 'medium', 'semibold']" :key="x" :value="x">
                  {{ x.toUpperCase() }}
                </a-select-option>
              </a-select>
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.titleSize', 'Cỡ chữ tiêu đề') }} ({{ s.titleSize }}px)</span>
              <a-slider :value="s.titleSize" :min="14" :max="32" @change="update({ titleSize: $event as number })" />
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.bodySize', 'Cỡ chữ nội dung') }} ({{ s.bodySize }}px)</span>
              <a-slider :value="s.bodySize" :min="12" :max="20" @change="update({ bodySize: $event as number })" />
            </div>
            <div
              v-for="x in [{ k: 'boldText', l: 'boldText', label: 'Chữ đậm toàn trang' }, { k: 'italicText', l: 'italicText', label: 'Chữ nghiêng' }, { k: 'uppercaseText', l: 'uppercaseText', label: 'Chữ in hoa' }]"
              :key="x.k"
              class="config-row"
            >
              <span class="config-label">{{ t(`configSetting.${x.l}`, x.label) }}</span>
              <a-switch :checked="s[x.k as keyof DashboardSettings] as boolean" @change="update({ [x.k]: $event })" />
            </div>

            <!-- Primary Colors -->
            <div class="config-color-picker mt-2">
              <span class="config-label font-semibold">{{ t('configSetting.primaryColor', 'Màu chủ đạo') }}</span>
              <div class="color-grid mt-2">
                <button
                  v-for="c in PRIMARY_COLORS"
                  :key="c.value"
                  class="color-swatch cursor-pointer"
                  :class="{ active: s.primaryColor === c.value }"
                  :style="{ background: c.value }"
                  :title="c.name"
                  @click="update({ primaryColor: c.value })"
                >
                  <span v-if="s.primaryColor === c.value" class="color-dot" />
                </button>
              </div>
            </div>

            <!-- Navbar & Sidebar Colors -->
            <div v-for="kind in (['navbar', 'sidebar'] as const)" :key="kind" class="config-color-section mt-3">
              <div class="config-row">
                <span class="config-label font-semibold">{{ t(`configSetting.${kind}Color`, `Màu ${kind}`) }}</span>
                <a-select :value="s[`${kind}ColorType`]" class="control" @change="update({ [`${kind}ColorType`]: $event })">
                  <a-select-option value="solid">{{ t('configSetting.solidColor', 'Đơn sắc') }}</a-select-option>
                  <a-select-option value="gradient">{{ t('configSetting.gradientColor', 'Gradient') }}</a-select-option>
                </a-select>
              </div>
              <div v-for="mode in modes" :key="mode" class="config-sub">
                <span class="config-label config-label--sub">{{ t(mode === 'light' ? 'configSetting.themeLight' : 'configSetting.themeDark', mode === 'light' ? 'Chế độ Sáng' : 'Chế độ Tối') }}</span>
                <div class="color-grid">
                  <button
                    v-for="color in palette(kind, mode)"
                    :key="color"
                    class="color-swatch cursor-pointer"
                    :class="{ active: selectedColor(kind, mode) === color }"
                    :style="{ background: color }"
                    @click="chooseColor(kind, mode, color)"
                  >
                    <span v-if="selectedColor(kind, mode) === color" class="color-dot" :class="{ 'color-dot--dark': mode === 'dark' }" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Layout -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.layout', 'Kiểu bố cục') }}</h4>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.layoutMode', 'Bố cục layout') }}</span>
              <a-select :value="s.layoutMode" class="control" @change="update({ layoutMode: $event })">
                <a-select-option v-for="m in LAYOUT_MODES" :key="m.value" :value="m.value">
                  {{ m.value.toUpperCase() }}
                </a-select-option>
              </a-select>
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.sidebarPosition', 'Vị trí Sidebar') }}</span>
              <a-select :value="s.sidebarPosition" class="control" @change="update({ sidebarPosition: $event })">
                <a-select-option value="left">{{ t('configSetting.positionLeft', 'Bên trái') }}</a-select-option>
                <a-select-option value="right">{{ t('configSetting.positionRight', 'Bên phải') }}</a-select-option>
              </a-select>
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.configPosition', 'Vị trí nút cấu hình') }}</span>
              <a-select :value="s.configPosition" class="control" @change="update({ configPosition: $event })">
                <a-select-option value="left">{{ t('configSetting.positionLeft', 'Bên trái') }}</a-select-option>
                <a-select-option value="right">{{ t('configSetting.positionRight', 'Bên phải') }}</a-select-option>
              </a-select>
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Sidebar -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.sidebar', 'Thanh Sidebar') }}</h4>
            <div
              v-for="x in [{ k: 'showSidebar', l: 'showSidebar', label: 'Hiển thị Sidebar' }, { k: 'collapseSidebar', l: 'collapseSidebar', label: 'Thu nhỏ Sidebar' }, { k: 'accordionMenu', l: 'accordionMenu', label: 'Menu Accordion' }]"
              :key="x.k"
              class="config-row"
            >
              <span class="config-label">{{ t(`configSetting.${x.l}`, x.label) }}</span>
              <a-switch :checked="s[x.k as keyof DashboardSettings] as boolean" @change="update({ [x.k]: $event })" />
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.sidebarWidth', 'Độ rộng Sidebar') }} ({{ s.sidebarWidth }}px)</span>
              <a-slider :value="s.sidebarWidth" :min="200" :max="320" @change="update({ sidebarWidth: $event as number })" />
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.sidebarCollapsedWidth', 'Độ rộng khi thu gọn') }} ({{ s.sidebarCollapsedWidth }}px)</span>
              <a-slider :value="s.sidebarCollapsedWidth" :min="60" :max="100" @change="update({ sidebarCollapsedWidth: $event as number })" />
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Tabs -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.tabs', 'Thanh TabsBar') }}</h4>
            <div
              v-for="x in [{ k: 'showTabs', label: 'Hiển thị TabsBar' }, { k: 'persistTabs', label: 'Lưu trạng thái tab' }, { k: 'dragTabs', label: 'Kéo thả tab' }, { k: 'showTabIcons', label: 'Hiển thị icon tab' }, { k: 'showMaximizeTab', label: 'Nút phóng to' }, { k: 'showBreadcrumb', label: 'Hiển thị Breadcrumb' }]"
              :key="x.k"
              class="config-row"
            >
              <span class="config-label">{{ t(`configSetting.${x.k}`, x.label) }}</span>
              <a-switch :checked="s[x.k as keyof DashboardSettings] as boolean" @change="update({ [x.k]: $event })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.tabStyle', 'Kiểu Tab') }}</span>
              <a-select :value="s.tabStyle" class="control" @change="update({ tabStyle: $event })">
                <a-select-option v-for="x in TAB_STYLES" :key="x.value" :value="x.value">
                  {{ x.value.toUpperCase() }}
                </a-select-option>
              </a-select>
            </div>
            <div class="config-row config-row--col">
              <span class="config-label">{{ t('configSetting.maxTabs', 'Số tab tối đa') }} ({{ s.maxTabs }})</span>
              <a-slider :value="s.maxTabs" :min="3" :max="20" @change="update({ maxTabs: $event as number })" />
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Effects -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.effects', 'Hiệu ứng chuyển cảnh') }}</h4>
            <div
              v-for="x in [{ k: 'pageProgress', label: 'Thanh tiến trình tải trang' }, { k: 'pageLoader', label: 'Spinner tải trang' }, { k: 'pageTransition', label: 'Hiệu ứng chuyển trang' }]"
              :key="x.k"
              class="config-row"
            >
              <span class="config-label">{{ t(`configSetting.${x.k}`, x.label) }}</span>
              <a-switch :checked="s[x.k as keyof DashboardSettings] as boolean" @change="update({ [x.k]: $event })" />
            </div>
            <div class="config-row">
              <span class="config-label">{{ t('configSetting.transitionEffect', 'Hiệu ứng') }}</span>
              <a-select :value="s.transitionEffect" class="control" @change="update({ transitionEffect: $event })">
                <a-select-option v-for="x in TRANSITION_EFFECTS" :key="x.value" :value="x.value">
                  {{ x.value }}
                </a-select-option>
              </a-select>
            </div>
          </section>

          <a-divider style="margin: 12px 0" />

          <!-- Footer -->
          <section class="config-section">
            <h4 class="config-section-title">{{ t('configSetting.tab.footer', 'Cấu hình Chân trang (Footer)') }}</h4>
            <div
              v-for="x in [{ k: 'showFooter', label: 'Hiển thị Footer' }, { k: 'fixedFooter', label: 'Cố định Footer' }]"
              :key="x.k"
              class="config-row"
            >
              <span class="config-label">{{ t(`configSetting.${x.k}`, x.label) }}</span>
              <a-switch :checked="s[x.k as keyof DashboardSettings] as boolean" @change="update({ [x.k]: $event })" />
            </div>
            <div
              v-for="x in [{ k: 'companyName', label: 'Tên Doanh nghiệp' }, { k: 'companyWebsite', label: 'Website' }, { k: 'copyrightYear', label: 'Năm bản quyền' }, { k: 'icpNumber', label: 'Số GP / ICP' }, { k: 'icpLink', label: 'Link GP' }]"
              :key="x.k"
              class="config-sub"
            >
              <span class="config-label config-label--sub">{{ t(`configSetting.${x.k}`, x.label) }}</span>
              <a-input :value="s[x.k as keyof DashboardSettings]" @update:value="update({ [x.k]: $event })" />
            </div>
          </section>
        </main>

        <footer class="config-footer flex items-center justify-between gap-2 mt-4">
          <a-button @click="reset">
            <ReloadOutlined /> {{ t('configSetting.reset', 'Mặc định') }}
          </a-button>
          <a-button @click="copyConfig">
            <CopyOutlined /> {{ t('configSetting.copyConfig', 'Sao chép') }}
          </a-button>
          <a-button danger class="config-logout-btn" @click="clearCacheAndLogout">
            <LogoutOutlined /> {{ t('configSetting.clearCacheLogout', 'Xóa cache') }}
          </a-button>
        </footer>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped lang="scss">
.config-float-btn {
  position: fixed;
  width: 44px;
  height: 44px;
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  z-index: 999;
  font-size: 20px;
  touch-action: none;
  cursor: grab;
  transition: transform 0.15s ease, background-color 0.3s ease;
}

.config-float-btn:active {
  cursor: grabbing;
  transform: scale(1.06);
}

.config-spin-icon {
  animation: spin 6s linear infinite;
}
@keyframes spin {
  100% { transform: rotate(360deg); }
}

.config-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.config-header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);

  .config-header-icon {
    font-size: 18px;
    color: var(--primary);
  }
}

.config-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 4px 12px 0;
}

.config-section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;

  &--col {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    :deep(.ant-slider) {
      width: 100%;
      margin: 6px 0;
    }
  }

  .control {
    width: 160px;
  }
}

.config-sub {
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.color-swatch {
  height: 28px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }

  &.active {
    box-shadow: 0 0 0 2px var(--primary);
  }
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;

  &--dark {
    background: #000000;
  }
}

.config-footer {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
</style>
