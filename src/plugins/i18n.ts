import axios from 'axios';
import { createI18n } from 'vue-i18n';

const LOCALE_KEY = 'wms_locale';

function deepMerge(target: any, source: any): any {
  if (!target) return source;
  if (!source) return target;
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export async function loadLocaleMessages(lang: string): Promise<Record<string, any>> {
  try {
    const manifestRes = await axios.get<string[]>('/i18n/manifest.json');
    const files = manifestRes.data || [];

    const fileRequests = files.map((file) =>
      axios
        .get(`/i18n/${lang}/${file}`)
        .then((res) => res.data)
        .catch(() => {
          console.warn(`[i18n] Missing translation file: /i18n/${lang}/${file}`);
          return {};
        }),
    );

    const results = await Promise.all(fileRequests);
    return results.reduce((acc, curr) => deepMerge(acc, curr), {});
  } catch (err) {
    console.error(`[i18n] Failed to load messages for ${lang}:`, err);
    return {};
  }
}

export const initialLocale = (localStorage.getItem(LOCALE_KEY) as 'vi' | 'en') || 'vi';

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'vi',
  messages: {
    vi: {},
    en: {},
  },
});

export async function setI18nLanguage(lang: 'vi' | 'en') {
  if (Object.keys(i18n.global.getLocaleMessage(lang)).length === 0) {
    const messages = await loadLocaleMessages(lang);
    i18n.global.setLocaleMessage(lang, messages);
  }
  (i18n.global.locale as any).value = lang;
  localStorage.setItem(LOCALE_KEY, lang);
  document.querySelector('html')?.setAttribute('lang', lang);
}
