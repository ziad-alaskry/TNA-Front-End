import type { Metadata } from 'next'
import '@/app/globals.css'
import Providers from '@/components/shell/Providers'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { isValidLocale, getDirection, type Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/request'
import { notFound } from 'next/navigation'
import { Rubik } from 'next/font/google'
import { GovProvider } from '@/context/GovContext';
import { FleetProvider } from '@/context/FleetContext';
import { BindingProvider } from '@/context/BindingContext';
import { ToastProvider } from '@/components/ui/Toast';

const rubik = Rubik({ subsets: ['latin', 'arabic'], weight: ['300', '400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: {
    template: '%s | TNA - العنوان الوطني المؤقت',
    default: 'TNA - العنوان الوطني المؤقت | Temporary National Address',
  },
  description: 'النظام السعودي الشامل للعنوان الوطني المؤقت - إدارة وتوثيق وربط العناوين بأعلى المعايير.',
  applicationName: 'TNA Platform',
  authors: [{ name: 'SDAIA' }],
  generator: 'Next.js',
  keywords: ['TNA', 'National Address', 'Saudi Arabia', 'SDAIA', 'Logistics'],
  creator: 'SDAIA Innovation',
  publisher: 'SDAIA',
  openGraph: {
    title: 'TNA - Temporary National Address',
    description: 'The Saudi comprehensive system for temporary national addresses.',
    siteName: 'TNA Platform',
    locale: 'ar_SA',
    type: 'website',
  },
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
      <body suppressHydrationWarning className={`${rubik.className} bg-surface-100 text-neutral-900`}>
        <LocaleProvider locale={validLocale} messages={messages}>
          <ToastProvider>
            <GovProvider>
              <FleetProvider>
                <BindingProvider>
                  <Providers>{children}</Providers>
                </BindingProvider>
              </FleetProvider>
            </GovProvider>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
