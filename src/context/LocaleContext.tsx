import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Locales } from './../core/locales';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import { en, ru, registerTranslation } from 'react-native-paper-dates';

const I18nContext = createContext({
  locale: 'en',
  setLocale: (locale: string) => {},
  t: (key: string) => Locales.t(key),
});

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const loadLocale = async () => {
      const storedLocale = await SecureStore.getItemAsync('language');
      const systemLocale = Localization.getLocales()[0].languageCode || 'en';
      const finalLocale = storedLocale || systemLocale;

      Locales.locale = finalLocale;
      setLocale(finalLocale);
    };
    loadLocale();
  }, []);

  registerTranslation('en', en);
  registerTranslation('ru', ru);

  const changeLocale = async (newLocale: string) => {
    Locales.locale = newLocale;
    setLocale(newLocale);
    await SecureStore.setItemAsync('language', newLocale);
  };

  return (
    <I18nContext.Provider
      value={{ locale, setLocale: changeLocale, t: Locales.t.bind(Locales) }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
