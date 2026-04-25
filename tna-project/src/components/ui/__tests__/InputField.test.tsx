import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from '../InputField';
import userEvent from '@testing-library/user-event';
import { MagnifyingGlass } from '@phosphor-icons/react';

describe('InputField Component', () => {
    it('renders with a label and input element', () => {
        render(<InputField label="Email Address" placeholder="Enter email" />);
        const input = screen.getByPlaceholderText('Enter email');
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('renders an icon if provided', () => {
        const { container } = render(<InputField label="Search" icon={MagnifyingGlass} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('displays error message when error prop is provided', () => {
        render(<InputField label="Password" error="Password is too short" />);
        expect(screen.getByText('Password is too short')).toBeInTheDocument();
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-error');
    });

    it('handles user input correctly', async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        
        render(<InputField label="Username" onChange={onChange} />);
        const input = screen.getByRole('textbox');
        
        await user.type(input, 'testuser');
        expect(onChange).toHaveBeenCalledTimes(8);
        expect(input).toHaveValue('testuser');
    });
});
