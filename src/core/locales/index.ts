import { I18n } from 'i18n-js';

import English from './en/translation.json';
import Russian from './ru/translation.json';
import Kazakh from './kz/translation.json';

export const Locales = new I18n({
  en: English,
  ru: Russian,
  kz: Kazakh,
});

Locales.enableFallback = true;
Locales.defaultLocale = 'en';
