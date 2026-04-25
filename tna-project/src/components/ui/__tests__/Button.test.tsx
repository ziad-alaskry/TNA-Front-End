import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
    it('renders with children', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        render(<Button onClick={onClick}>Click Me</Button>);
        
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('renders as disabled if disabled prop is true', () => {
        render(<Button disabled>Click Me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
