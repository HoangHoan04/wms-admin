<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import { theme } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const dashboardStore = useDashboardStore();

const antLocale = computed(() => {
  return locale.value === 'en' ? enUS : viVN;
});

const isDark = computed(() => dashboardStore.isDarkMode);

const antdTheme = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: dashboardStore.settings.primaryColor,
    borderRadius: dashboardStore.settings.borderRadius,
    fontFamily: dashboardStore.settings.fontFamily,
    colorBgContainer: isDark.value ? '#141414' : '#ffffff',
    colorBgElevated: isDark.value ? '#1f1f1f' : '#ffffff',
    colorBgLayout: isDark.value ? '#000000' : '#f5f5f5',
  },
}));

onMounted(() => {
  dashboardStore.applyDomEffects();
});
</script>

<template>
  <a-config-provider :theme="antdTheme" :locale="antLocale">
    <router-view />
  </a-config-provider>
</template>

<style>
/* Base root CSS */
</style>
