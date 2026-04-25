import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GovProvider, useGov } from '../GovContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
    const { tnaData, updateTnaStatus, activeRole, setActiveRole } = useGov();
    return (
        <div>
            <div data-testid="tna-count">{tnaData.length}</div>
            <div data-testid="active-role">{activeRole}</div>
            <button onClick={() => updateTnaStatus('TNA-102', 'approved')}>Approve TNA</button>
            <button onClick={() => setActiveRole('auditor')}>Switch Role</button>
            <div data-testid="tna-status">
               {tnaData.find(t => t.id === 'TNA-102')?.status || 'not found'}
            </div>
        </div>
    );
};

describe('GovContext Integration', () => {
    it('provides government data and allows status and role updates', async () => {
        const user = userEvent.setup();
        render(
            <GovProvider>
                <TestComponent />
            </GovProvider>
        );

        // Check active role
        expect(screen.getByTestId('active-role').textContent).toBe('reviewer');

        // Check if there are tnas
        expect(Number(screen.getByTestId('tna-count').textContent)).toBeGreaterThan(0);
        
        // Approve TNA
        await user.click(screen.getByText('Approve TNA'));
        expect(screen.getByTestId('tna-status').textContent).toBe('approved');

        // Switch role
        await user.click(screen.getByText('Switch Role'));
        expect(screen.getByTestId('active-role').textContent).toBe('auditor');
    });
});
