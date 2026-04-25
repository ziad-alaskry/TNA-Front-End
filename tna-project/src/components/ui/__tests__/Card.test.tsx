import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../Card';

describe('Card Component', () => {
    it('renders with children', () => {
        render(
            <Card>
                <p>Card Content</p>
            </Card>
        );
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders with no padding if noPadding is true', () => {
        const { container } = render(<Card noPadding>Test</Card>);
        const cardDiv = container.firstChild as HTMLDivElement;
        // ensure standard padding class is absent or it relies on component implementation
        // For example, if it conditionally removes 'p-6'
        expect(cardDiv.className).not.toContain('p-6');
    });

    it('accepts additional class names', () => {
        const { container } = render(<Card className="my-custom-class">Test</Card>);
        const cardDiv = container.firstChild as HTMLDivElement;
        expect(cardDiv.className).toContain('my-custom-class');
    });
});
