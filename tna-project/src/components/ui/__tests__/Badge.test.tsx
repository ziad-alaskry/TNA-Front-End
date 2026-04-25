import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';

describe('Badge Component', () => {
    it('renders with default props', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');
        expect(badge).toBeInTheDocument();
        // default variant is primary (neutral bg now replaced by SPATIAL)?
        // Wait, what does Badge output. We'll check its classes.
    });

    it('renders with success variant', () => {
        render(<Badge variant="success">Active</Badge>);
        const badge = screen.getByText('Active');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-success-bg', 'text-success');
    });

    it('renders with custom className', () => {
        render(<Badge className="custom-class">Custom</Badge>);
        expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });
});
