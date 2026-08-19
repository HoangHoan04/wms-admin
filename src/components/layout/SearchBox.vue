<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar.store';
import { useTabsStore } from '@/stores/tabs.store';
import {
  AppstoreOutlined,
  CloseOutlined,
  DashboardOutlined,
  DeleteOutlined,
  EnterOutlined,
  HistoryOutlined,
  HomeOutlined,
  InboxOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

interface SearchOption {
  title: string;
  path: string;
  category: string;
  icon?: string;
}

const iconMap: Record<string, any> = {
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  InboxOutlined,
  TeamOutlined,
  SettingOutlined,
};

const { t } = useI18n();
const router = useRouter();
const tabsStore = useTabsStore();
const sidebarStore = useSidebarStore();

const isOpen = ref(false);
const query = ref('');
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

const STORAGE_RECENT_KEY = 'wms_recent_searches';

function getItemTitle(item: any) {
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

// Dynamically extract searchable items from sidebar menus
const dynamicSearchItems = computed<SearchOption[]>(() => {
  const list: SearchOption[] = [];
  const traverse = (items: any[], parentCategory?: string) => {
    items.forEach((menu) => {
      const currentTitle = getItemTitle(menu);
      const categoryTitle = parentCategory || currentTitle;
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children, categoryTitle);
      } else if (menu.path) {
        list.push({
          title: currentTitle,
          path: menu.path,
          category: categoryTitle,
          icon: menu.icon || 'AppstoreOutlined',
        });
      }
    });
  };

  traverse(sidebarStore.menus);
  return list;
});

// Recent searches (Empty by default, only saved when user searches & clicks)
const recentSearches = ref<SearchOption[]>(
  (() => {
    try {
      const raw = localStorage.getItem(STORAGE_RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })(),
);

function saveRecent(option: SearchOption) {
  const current = recentSearches.value.filter((o) => o.path !== option.path);
  current.unshift(option);
  if (current.length > 6) current.pop();
  recentSearches.value = current;
  localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(current));
}

function removeRecent(e: MouseEvent, path: string) {
  e.stopPropagation();
  recentSearches.value = recentSearches.value.filter((o) => o.path !== path);
  localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(recentSearches.value));
}

function clearRecent() {
  recentSearches.value = [];
  localStorage.removeItem(STORAGE_RECENT_KEY);
}

const searchResults = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return dynamicSearchItems.value.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(q);
    const pathMatch = item.path.toLowerCase().includes(q);
    const categoryMatch = item.category.toLowerCase().includes(q);
    return titleMatch || pathMatch || categoryMatch;
  });
});

function openModal() {
  isOpen.value = true;
  query.value = '';
  activeIndex.value = 0;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function closeModal() {
  isOpen.value = false;
  query.value = '';
}

function navigateTo(option: SearchOption) {
  saveRecent(option);
  tabsStore.addTab({
    key: option.path,
    title: option.title,
    path: option.path,
  });
  sidebarStore.setSelectedKeys([option.path]);
  closeModal();
  router.push(option.path);
}

function onInputKeydown(e: KeyboardEvent) {
  const list = query.value ? searchResults.value : recentSearches.value;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (list.length > 0) {
      activeIndex.value = (activeIndex.value + 1) % list.length;
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (list.length > 0) {
      activeIndex.value = (activeIndex.value - 1 + list.length) % list.length;
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (list.length > 0 && list[activeIndex.value]) {
      navigateTo(list[activeIndex.value]);
    }
  } else if (e.key === 'Escape') {
    closeModal();
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (isOpen.value) {
      closeModal();
    } else {
      openModal();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <div class="search-box-container">
    <!-- Search Trigger Pill on Navbar -->
    <div
      class="search-trigger cursor-pointer"
      title="Tìm kiếm nhanh (Ctrl + K)"
      @click="openModal"
    >
      <div class="search-trigger-content">
        <SearchOutlined class="search-trigger-icon" />
        <span class="search-trigger-text">{{ t('navbar.quickSearch', 'Tìm kiếm...') }}</span>
      </div>
      <kbd class="search-kbd">Ctrl K</kbd>
    </div>

    <!-- Spotlight Command Palette Modal -->
    <teleport to="body">
      <transition name="search-fade">
        <div v-if="isOpen" class="search-overlay" @click="closeModal">
          <div class="search-dialog" @click.stop>
            <!-- Header Bar with Search Input -->
            <div class="search-header">
              <div class="search-input-wrap">
                <SearchOutlined class="search-header-icon" />
                <input
                  ref="inputRef"
                  v-model="query"
                  class="search-input"
                  :placeholder="t('search.placeholder', 'Nhập tên trang hoặc chức năng...')"
                  autocomplete="off"
                  @keydown="onInputKeydown"
                />
              </div>

              <div class="search-header-actions">
                <button v-if="query" class="search-header-btn" title="Xóa từ khóa" @click="query = ''">
                  <CloseOutlined />
                </button>
                <span class="search-badge cursor-pointer" @click="closeModal">ESC</span>
              </div>
            </div>

            <!-- Body Content -->
            <div class="search-body">
              <!-- When Searching (Query exists) -->
              <template v-if="query">
                <div class="search-section">
                  <div class="search-section-header">
                    <span class="search-section-title">
                      {{ t('search.results', 'Kết quả tìm kiếm') }} ({{ searchResults.length }})
                    </span>
                  </div>

                  <div v-if="searchResults.length > 0" class="search-list">
                    <div
                      v-for="(item, idx) in searchResults"
                      :key="item.path"
                      class="search-item"
                      :class="{ 'search-item-active': idx === activeIndex }"
                      @click="navigateTo(item)"
                      @mouseenter="activeIndex = idx"
                    >
                      <div class="search-item-left">
                        <div class="search-item-icon-wrap" :class="{ 'search-item-icon-active': idx === activeIndex }">
                          <component :is="iconMap[item.icon || 'AppstoreOutlined'] || AppstoreOutlined" />
                        </div>
                        <div class="search-item-info">
                          <div class="search-item-label">{{ item.title }}</div>
                          <div class="search-item-sub">{{ item.category }}</div>
                        </div>
                      </div>

                      <div class="search-item-right">
                        <span class="search-item-path">{{ item.path }}</span>
                        <EnterOutlined v-if="idx === activeIndex" class="search-item-enter" />
                      </div>
                    </div>
                  </div>

                  <!-- Empty state when query has no match -->
                  <div v-else class="search-empty">
                    <p class="search-empty-title">Không tìm thấy kết quả cho "{{ query }}"</p>
                    <p class="search-empty-desc">Vui lòng kiểm tra lại từ khóa tìm kiếm.</p>
                  </div>
                </div>
              </template>

              <!-- When NOT Searching (Empty Query) -->
              <template v-else>
                <!-- Recent Searches Section (Only shown when user has search history) -->
                <div v-if="recentSearches.length > 0" class="search-section">
                  <div class="search-recent-header">
                    <span class="search-section-title">{{ t('search.recentSearches', 'Lịch sử tìm kiếm gần đây') }}</span>
                    <button class="search-clear-all" @click="clearRecent">
                      {{ t('search.clearAll', 'Xóa tất cả') }}
                    </button>
                  </div>

                  <div class="search-list">
                    <div
                      v-for="(item, idx) in recentSearches"
                      :key="item.path"
                      class="search-item"
                      :class="{ 'search-item-active': idx === activeIndex }"
                      @click="navigateTo(item)"
                      @mouseenter="activeIndex = idx"
                    >
                      <div class="search-item-left">
                        <div class="search-item-icon-wrap" :class="{ 'search-item-icon-active': idx === activeIndex }">
                          <HistoryOutlined />
                        </div>
                        <div class="search-item-info">
                          <div class="search-item-label">{{ item.title }}</div>
                          <div class="search-item-sub">{{ item.category }}</div>
                        </div>
                      </div>

                      <div class="search-item-right">
                        <span class="search-item-path">{{ item.path }}</span>
                        <button class="search-item-remove" title="Xóa" @click="(e) => removeRecent(e, item.path)">
                          <DeleteOutlined />
                        </button>
                        <EnterOutlined v-if="idx === activeIndex" class="search-item-enter" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Initial Clean Compact Hint when no history exists -->
                <div v-else class="search-initial-hint">
                  <span class="search-initial-desc">Nhập tên trang hoặc chức năng để chuyển nhanh</span>
                </div>
              </template>
            </div>

            <!-- Footer Help Bar -->
            <div class="search-footer">
              <div class="search-footer-left">
                <span class="search-footer-hint">
                  <kbd class="search-kbd-sm">↑</kbd><kbd class="search-kbd-sm">↓</kbd> Di chuyển
                </span>
                <span class="search-footer-hint">
                  <kbd class="search-kbd-sm">↵</kbd> Chọn
                </span>
                <span class="search-footer-hint">
                  <kbd class="search-kbd-sm">ESC</kbd> Đóng
                </span>
              </div>
              <div class="search-footer-right">
                <span class="footer-portal-text">WMS SMART</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.search-box-container {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: normal;
}

/* Navbar Trigger Pill */
.search-trigger {
  height: 32px !important;
  max-height: 32px !important;
  min-width: 150px;
  max-width: 190px;
  padding: 0 8px 0 10px;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  line-height: 1;
  box-sizing: border-box;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: var(--primary);
    background: var(--background);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .search-trigger-icon {
      color: var(--primary);
    }
  }

  .search-trigger-content {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
  }

  .search-trigger-icon {
    color: var(--muted-foreground);
    font-size: 13px;
    flex-shrink: 0;
  }

  .search-trigger-text {
    font-size: 12px;
    color: var(--muted-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-kbd {
    font-size: 10px;
    font-family: inherit;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: 3px;
    background: var(--background-card);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    flex-shrink: 0;
    line-height: 1.2;
  }
}

/* Modal Overlay (Glassmorphism & Spotlight) */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  overflow: hidden;
  box-sizing: border-box;
}

.search-dialog {
  width: 90%;
  max-width: 480px;
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.search-header {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--background-card);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;

    .search-header-icon {
      font-size: 15px;
      color: var(--primary);
    }

    .search-input {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13.5px;
      color: var(--foreground);
      font-weight: 500;

      &::placeholder {
        color: var(--muted-foreground);
        opacity: 0.6;
      }
    }
  }

  .search-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .search-header-btn {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: none;
    background: var(--muted);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.15s ease;

    &:hover {
      background: var(--background-hover);
      color: var(--foreground);
    }
  }

  .search-badge {
    font-size: 9.5px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--muted);
    border: 1px solid var(--border);
    color: var(--muted-foreground);
  }
}

/* Body */
.search-body {
  padding: 8px 10px;
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
}

.search-section-header {
  margin-bottom: 6px;
}

.search-section-title {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 4px;
}

.search-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-item {
  padding: 6px 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.12s ease;

  &:hover,
  &.search-item-active {
    background: var(--primary-muted);
    border-color: var(--primary);

    .search-item-icon-wrap {
      background: var(--primary);
      color: #fff;
    }

    .search-item-label {
      color: var(--primary);
    }

    .search-item-remove {
      opacity: 1;
    }
  }

  .search-item-left {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }

  .search-item-icon-wrap {
    width: 26px;
    height: 26px;
    min-width: 26px;
    border-radius: 6px;
    background: var(--muted);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.12s ease;
  }

  .search-item-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .search-item-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--foreground);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-item-sub {
      font-size: 10px;
      color: var(--muted-foreground);
    }
  }

  .search-item-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .search-item-path {
    font-size: 10px;
    font-family: monospace;
    padding: 1px 4px;
    border-radius: 3px;
    background: var(--muted);
    color: var(--muted-foreground);
  }

  .search-item-remove {
    background: none;
    border: none;
    color: var(--muted-foreground);
    padding: 2px;
    border-radius: 3px;
    opacity: 0;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.12s ease;

    &:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
  }

  .search-item-enter {
    font-size: 11px;
    color: var(--primary);
  }
}

/* Initial Hint State (Minimal & Compact) */
.search-initial-hint {
  padding: 14px 8px;
  text-align: center;

  .search-initial-desc {
    font-size: 12px;
    color: var(--muted-foreground);
  }
}

/* Empty States */
.search-empty {
  padding: 16px 8px;
  text-align: center;

  .search-empty-title {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
  }

  .search-empty-desc {
    font-size: 11px;
    color: var(--muted-foreground);
    margin: 4px 0 0 0;
  }
}

.search-recent-header {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search-clear-all {
    font-size: 10px;
    color: #ef4444;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

/* Footer Help Bar */
.search-footer {
  padding: 6px 12px;
  background: var(--muted);
  border-top: 1px solid var(--border);
  font-size: 10px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search-footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-footer-hint {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .search-kbd-sm {
    font-family: inherit;
    font-size: 9px;
    padding: 1px 3px;
    border-radius: 3px;
    background: var(--background-card);
    border: 1px solid var(--border);
    color: var(--foreground);
  }

  .footer-portal-text {
    font-weight: 600;
    color: var(--primary);
  }
}

/* Animations */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
