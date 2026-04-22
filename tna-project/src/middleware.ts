import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './i18n/config';

const LOCAL_STORAGE_KEY = 'tna-locale'; // This should match the key in LanguageSwitcher.tsx

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static assets, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Determine the locale from the cookie first (Prioritized)
  const cookieLocale = request.cookies.get(LOCAL_STORAGE_KEY)?.value;
  const validCookieLocale = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : undefined;

  // 2. Determine the locale from the URL
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. Decide target locale
  // If we have a cookie, it's our source of truth.
  // Otherwise, use the URL locale, or fallback to default.
  const targetLocale = validCookieLocale || pathnameLocale || defaultLocale;

  // 4. Handle Redirection
  // Redirect if:
  // - No locale in URL (e.g., /dashboard -> /en/dashboard)
  // - URL locale doesn't match the prioritized target locale (e.g., /en/dashboard but cookie is 'ar' -> /ar/dashboard)
  if (!pathnameLocale || pathnameLocale !== targetLocale) {
    const url = request.nextUrl.clone();
    const restOfPath = pathnameLocale 
      ? pathname.substring(pathnameLocale.length + 1) 
      : pathname;
    
    url.pathname = `/${targetLocale}${restOfPath.startsWith('/') ? restOfPath : '/' + restOfPath}`;
    
    return NextResponse.redirect(url);
  }

  // 5. Update cookie if user explicitly navigated to a URL with a locale that was valid but different from cookie
  // (This part is tricky because if we prioritize the cookie, we always redirect AWAY from the mismatch.
  //  So if a user wants to switch, they MUST use the LanguageSwitcher which updates the cookie.)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};