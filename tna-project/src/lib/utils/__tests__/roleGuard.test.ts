import { describe, it, expect } from 'vitest';
import { hasRole } from '../roleGuard';

describe('RoleGuard (hasRole)', () => {
    it('returns true if the user role matches one of the allowed roles exactly', () => {
        expect(hasRole('Admin', ['Admin', 'Manager'])).toBe(true);
    });

    it('returns true if the user role matches ignoring case', () => {
        expect(hasRole('visitor', ['Visitor', 'Owner'])).toBe(true);
    });

    it('returns false if the user role is not in the allowed roles', () => {
        expect(hasRole('User', ['Admin', 'Manager'])).toBe(false);
    });

    it('returns false if user role is null or undefined', () => {
        expect(hasRole(null, ['Admin'])).toBe(false);
        expect(hasRole(undefined, ['Admin'])).toBe(false);
    });

    it('returns true if allowed roles array is empty', () => {
        expect(hasRole('User', [])).toBe(true);
    });
});
