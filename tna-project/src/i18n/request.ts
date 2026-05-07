import { Locale } from './config';

export async function getMessages(locale: Locale) {
  try {
    return (await import(`../../public/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}
