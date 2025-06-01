export type SupportedLocale = 'en' | 'ru' | 'kz';

export const formatDate = (
  dateString: string,
  locale: SupportedLocale = 'en',
) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const localeFormats: Record<SupportedLocale, Intl.DateTimeFormatOptions> = {
      en: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      ru: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      kz: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
    };

    const localeMapping: Record<SupportedLocale, string> = {
      en: 'en-US',
      ru: 'ru-RU',
      kz: 'ru-RU',
    };

    return date.toLocaleDateString(
      localeMapping[locale],
      localeFormats[locale],
    );
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
