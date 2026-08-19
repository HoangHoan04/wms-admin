<script setup lang="ts">
import { setI18nLanguage } from '@/plugins/i18n';
import { useDashboardStore } from '@/stores/dashboard.store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const dashboardStore = useDashboardStore();

const currentLang = computed(() => locale.value);

const languages = [
  { code: 'vi', label: 'Tiếng Việt', icon: '/src/assets/icons/vi.svg' },
  { code: 'en', label: 'English', icon: '/src/assets/icons/en.svg' },
];

async function onSelectLang(lang: string) {
  await setI18nLanguage(lang as 'vi' | 'en');
  dashboardStore.updateSettings({ language: lang as 'vi' | 'en' });
}
</script>

<template>
  <a-dropdown trigger="click" placement="bottomRight">
    <div class="lang-trigger flex items-center gap-2 cursor-pointer">
      <img
        :src="currentLang === 'vi' ? '/src/assets/icons/vi.svg' : '/src/assets/icons/en.svg'"
        :alt="currentLang"
        class="lang-flag"
      />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item
          v-for="item in languages"
          :key="item.code"
          :class="{ 'ant-menu-item-selected': currentLang === item.code }"
          @click="onSelectLang(item.code)"
        >
          <div class="flex items-center gap-2">
            <img :src="item.icon" :alt="item.code" class="lang-flag" />
            <span>{{ item.label }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.lang-trigger {
  padding: 6px 10px;
  border-radius: var(--radius-md);
  transition: background 0.2s ease;
}
.lang-trigger:hover {
  background: var(--muted);
}
.lang-flag {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
}
.lang-label {
  font-size: 13px;
  font-weight: 600;
}
</style>
