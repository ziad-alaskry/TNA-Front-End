import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate util', () => {
    it('formats a date to English correctly', () => {
        const date = new Date('2025-01-15T00:00:00Z');
        const formatted = formatDate(date, 'en-US');
        expect(formatted).toMatch(/Jan 15, 2025/i);
    });

    it('formats a date to Arabic correctly', () => {
        const date = new Date('2025-01-15T00:00:00Z');
        const formatted = formatDate(date, 'ar-SA');
        // Will contain "2025" or Eastern Arabic numerals for 2025
        expect(formatted.includes('2025') || formatted.includes('٢٠٢٥')).toBe(true);
    });

    it('handles invalid dates gracefully', () => {
        expect(formatDate('invalid-date')).toBe('invalid-date');
    });

    it('handles empty values gracefully', () => {
        expect(formatDate('')).toBe('');
    });
});
