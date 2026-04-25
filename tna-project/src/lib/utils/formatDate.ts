/**
 * Formats a given date to a localized string.
 * @param date The date to format (Date object, timestamp, or string).
 * @param locale The locale string (e.g., 'ar-SA', 'en-US'). Default is 'en-US'.
 * @returns Fully formatted date string.
 */
export function formatDate(date: string | number | Date, locale: string = 'en-US'): string {
    if (!date) return '';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(d);
    } catch {
        return String(date);
    }
}