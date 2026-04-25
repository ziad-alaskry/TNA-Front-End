import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BindingProvider, useBinding } from '../BindingContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
    const { visitorTnas, ownerAccount, acceptBindingRequest } = useBinding();
    return (
        <div>
            <div data-testid="tna-count">{visitorTnas.length}</div>
            <div data-testid="wallet-balance">{ownerAccount.wallet_balance}</div>
            <button onClick={() => acceptBindingRequest('bind-101')}>Accept Bind</button>
            <div data-testid="binding-status">
               {visitorTnas.flatMap(t => t.bindings).find(b => b.binding_id === 'bind-101')?.status || 'not found'}
            </div>
        </div>
    );
};

describe('BindingContext Integration', () => {
    it('provides binding data and allows accepting requests', async () => {
        const user = userEvent.setup();
        render(
            <BindingProvider>
                <TestComponent />
            </BindingProvider>
        );

        // Check if there are tnas
        expect(Number(screen.getByTestId('tna-count').textContent)).toBeGreaterThan(0);
        
        // Accept Binding Request (bind-101 should exist in the initial mock and change to active)
        await user.click(screen.getByText('Accept Bind'));
        expect(screen.getByTestId('binding-status').textContent).toBe('active');
    });
});
