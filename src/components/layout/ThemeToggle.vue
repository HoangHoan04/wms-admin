<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const theme = computed(() => dashboardStore.settings.theme);

const themeTitle = computed(() => {
  if (theme.value === 'light') return t('theme.light', 'Giao diện Sáng');
  if (theme.value === 'dark') return t('theme.dark', 'Giao diện Tối');
  return t('theme.system', 'Giao diện Hệ thống');
});

function cycleTheme(event: MouseEvent) {
  // Determine next theme mode
  let nextTheme: 'light' | 'dark' | 'system' = 'light';
  if (theme.value === 'light') {
    nextTheme = 'dark';
  } else if (theme.value === 'dark') {
    nextTheme = 'system';
  } else {
    nextTheme = 'light';
  }

  // 1. Calculate EXACT center coordinates of the toggle button
  const targetEl = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const btnEl = (targetEl?.closest('.theme-toggle-btn') || targetEl) as HTMLElement;
  const rect = btnEl?.getBoundingClientRect();

  const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 120;
  const y = rect ? rect.top + rect.height / 2 : 28;

  // Max radius covering all 4 screen corners from button center
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  // Check next theme target color
  const willBeDark =
    nextTheme === 'dark' ||
    (nextTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const nextBgColor = willBeDark ? '#141414' : '#f8f9fa';

  // 2. Create and trigger expanding circular ripple element from button center
  const ripple = document.createElement('div');
  ripple.className = 'theme-circle-ripple-wave';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.backgroundColor = nextBgColor;
  ripple.style.setProperty('--max-radius', `${endRadius * 2.3}px`);
  document.body.appendChild(ripple);

  // 3. Switch theme while the circle covers the screen
  setTimeout(() => {
    dashboardStore.updateSettings({ theme: nextTheme });
  }, 220);

  // 4. Remove ripple element after wave animation finishes
  setTimeout(() => {
    ripple.remove();
  }, 650);
}
</script>

<template>
  <div
    class="theme-toggle-btn cursor-pointer flex items-center justify-center"
    :class="[`theme-${theme}`]"
    :title="themeTitle"
    @click="cycleTheme"
  >
    <!-- 1. Light Mode: Mặt trời (Sun) -->
    <svg
      v-if="theme === 'light'"
      class="theme-icon icon-sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" fill="#f59e0b" stroke="#f59e0b" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>

    <!-- 2. Dark Mode: Mặt trăng (Moon) -->
    <svg
      v-else-if="theme === 'dark'"
      class="theme-icon icon-moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#38bdf8"
        stroke="#38bdf8"
      />
    </svg>

    <!-- 3. System Mode: Laptop / Máy tính -->
    <svg
      v-else
      class="theme-icon icon-laptop"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.theme-toggle-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10000000;

  &:hover {
    background: var(--muted);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.theme-icon {
  width: 19px;
  height: 19px;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.icon-sun {
  color: #f59e0b;
  animation: rotate-in 0.3s ease-out;
}

.icon-moon {
  color: #38bdf8;
  animation: rotate-in 0.3s ease-out;
}

.icon-laptop {
  color: var(--primary);
  animation: scale-in 0.3s ease-out;
}

@keyframes rotate-in {
  from {
    transform: rotate(-45deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
