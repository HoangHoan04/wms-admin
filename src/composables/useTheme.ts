import { useDashboardStore } from '@/stores/dashboard.store';
import { theme } from 'ant-design-vue';
import { computed } from 'vue';

export function useTheme() {
  const store = useDashboardStore();

  const themeAlgorithm = computed(() => {
    return store.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm;
  });

  const antdConfig = computed(() => ({
    algorithm: themeAlgorithm.value,
    token: {
      colorPrimary: store.settings.primaryColor,
      borderRadius: store.settings.borderRadius,
      fontFamily: store.settings.fontFamily,
    },
  }));

  return {
    store,
    isDarkMode: computed(() => store.isDarkMode),
    settings: computed(() => store.settings),
    antdConfig,
    toggleTheme: store.toggleThemeMode,
    updateSettings: store.updateSettings,
  };
}
