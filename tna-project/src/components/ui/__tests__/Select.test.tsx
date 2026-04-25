import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from '../Select';
import userEvent from '@testing-library/user-event';

describe('Select Component', () => {
    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
    ];

    it('renders with label and options', () => {
        render(<Select label="Choose Option" options={options} />);
        
        expect(screen.getByText('Choose Option')).toBeInTheDocument();
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        
        // Options test
        const option1 = screen.getByRole('option', { name: 'Option 1' }) as HTMLOptionElement;
        expect(option1.value).toBe('1');
    });

    it('displays error state correctly', () => {
        render(<Select label="Error Select" options={options} error="Selection is required" />);
        expect(screen.getByText('Selection is required')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveClass('border-error');
    });

    it('handles selection changes', async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        
        render(<Select options={options} onChange={onChange} />);
        const select = screen.getByRole('combobox');
        
        await user.selectOptions(select, '2');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect((select as HTMLSelectElement).value).toBe('2');
    });
});
