import { createI18n } from 'vue-i18n'

import fr from '../locales/fr.json'
import en from '../locales/en.json'
import ar from '../locales/ar.json'
import fon from '../locales/fon.json'
import yo from '../locales/yo.json'

const messages = {
  fr,
  en,
  ar,
  fon,
  yo
}

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages
  })

  vueApp.use(i18n)
}) 