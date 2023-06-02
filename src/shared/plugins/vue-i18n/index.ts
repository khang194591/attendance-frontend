import { createI18n } from 'vue-i18n'
import { getEnLocalesFromModules, getLanguageFromStorage, getViLocalesFromModules } from './utils'

export enum SupportLanguage {
  en = 'en',
  vi = 'vi',
}

export const DEFAULT_LANGUAGE = SupportLanguage.en

export const i18n = createI18n({
  legacy: false,
  locale: getLanguageFromStorage(),
  fallbackLocale: DEFAULT_LANGUAGE,
  globalInjection: true,
  messages: {
    [SupportLanguage.en]: getEnLocalesFromModules(),
    [SupportLanguage.vi]: getViLocalesFromModules(),
  },
})
