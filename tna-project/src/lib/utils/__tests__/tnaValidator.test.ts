import { describe, it, expect } from 'vitest';
import { isValidTNA } from '../tnaValidator';

describe('TNA Validator (isValidTNA)', () => {
    it('returns true for a valid TNA with hyphens', () => {
        expect(isValidTNA('TNA-1234-ABCD')).toBe(true);
    });

    it('returns true for a valid TNA without hyphens', () => {
        expect(isValidTNA('TNA1234ABCD')).toBe(true);
    });

    it('returns true regardless of casing', () => {
        expect(isValidTNA('tna-8921-XyZp')).toBe(true);
    });

    it('returns false for missing parts', () => {
        expect(isValidTNA('TNA-123-ABCD')).toBe(false); // 3 digits
        expect(isValidTNA('TNA-1234-ABC')).toBe(false); // 3 letters
        expect(isValidTNA('1234-ABCD')).toBe(false); // Missing prefix
    });

    it('returns false for empty or nullish strings', () => {
        expect(isValidTNA('')).toBe(false);
        expect(isValidTNA('   ')).toBe(false);
        // @ts-expect-error testing invalid input
        expect(isValidTNA(null)).toBe(false);
    });
});
