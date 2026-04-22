import type { Metadata } from 'next'
import '@/app/globals.css'
import Providers from '@/components/shell/Providers'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { isValidLocale, getDirection, type Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/request'
import { notFound } from 'next/navigation'
import { Rubik } from 'next/font/google'
import { TNAProvider } from '@/context/TNAContext'; 

const rubik = Rubik({ subsets: ['latin', 'arabic'], weight: ['300', '400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'TNA Project',
  description: 'Total National Address Project',
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  if (!isValidLocale(locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const dir = getDirection(validLocale)
  const messages = await getMessages(validLocale)

  return (
    <html lang={validLocale} dir={dir} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${rubik.className} bg-slate-100 text-slate-900`}>
        <LocaleProvider locale={validLocale} messages={messages}>
          <TNAProvider>
            <Providers>{children}</Providers>
          </TNAProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
