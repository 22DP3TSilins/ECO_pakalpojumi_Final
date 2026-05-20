import { createI18n } from 'vue-i18n'
import lv from './locales/lv.js'
import en from './locales/en.js'

const i18n = createI18n({
  legacy: false, // Izmantot Composition API režīmu
  locale: localStorage.getItem('language') || 'lv', // Pēc noklusējuma latviešu valoda
  fallbackLocale: 'en',
  messages: {
    lv,
    en
  }
})

export default i18n
