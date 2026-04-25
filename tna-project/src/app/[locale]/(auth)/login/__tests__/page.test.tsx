import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../page';
import userEvent from '@testing-library/user-event';

// Mock useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock LocaleProvider
vi.mock('@/i18n/LocaleProvider', () => ({
    useLocale: () => ({
        locale: 'ar',
        isRTL: true,
        t: (key: string) => key,
    }),
}));

describe('Login Page Smoke Test', () => {
    it('renders login page with all role tabs', () => {
        render(<LoginPage />);
        
        expect(screen.getByText('تسجيل الدخول من خلال النفاذ الوطني الموحد') || screen.getByText(/نفاذ/)).toBeInTheDocument();
        
        // Check roles
        expect(screen.getByText('مالك')).toBeInTheDocument();
        expect(screen.getByText('ناقل')).toBeInTheDocument();
    });

    it('can switch roles', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);
        
        const carrierBtn = screen.getByText('ناقل');
        await user.click(carrierBtn);

        // Should update main login button text
        const mainLoginBtn = screen.getByRole('button', { name: /تسجيل الدخول كـ ناقل/i });
        expect(mainLoginBtn).toBeInTheDocument();
    });
});
