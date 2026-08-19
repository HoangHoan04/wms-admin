import { i18n, initialLocale, setI18nLanguage } from '@/plugins/i18n';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.scss';
import router from './router';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(Antd);
  app.use(i18n);
  app.use(router);

  // Pre-load initial locale translation files
  await setI18nLanguage(initialLocale);

  // Preload alternative language in background for instant switching
  const otherLocale = initialLocale === 'vi' ? 'en' : 'vi';
  setI18nLanguage(otherLocale).then(() => {
    (i18n.global.locale as any).value = initialLocale;
  });

  app.mount('#app');
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap WMS Admin app:', err);
});
