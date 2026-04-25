import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FleetProvider, useFleet } from '../FleetContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
    const { state, updateVehicleStatus } = useFleet();
    return (
        <div>
            <div data-testid="vehicle-count">{state.vehicles.length}</div>
            <button onClick={() => updateVehicleStatus('V-999', 'maintenance')}>Update Status</button>
            <div data-testid="vehicle-status">
               {state.vehicles.find(v => v.id === 'V-999')?.status || 'not found'}
            </div>
        </div>
    );
};

describe('FleetContext Integration', () => {
    it('provides default fleet state and allows updates', async () => {
        const user = userEvent.setup();
        render(
            <FleetProvider>
                <TestComponent />
            </FleetProvider>
        );

        // Initially V-999 is set to string "active" in the stub data (assuming we have one)
        // Check if there are vehicles
        expect(Number(screen.getByTestId('vehicle-count').textContent)).toBeGreaterThan(0);
        
        // Update the status of the first vehicle
        await user.click(screen.getByText('Update Status'));
        
        // We know V-999 exists in mock data or we can check what happens if it doesn't
        // But assuming V-999 is a known ID in the mock, it should update to maintenance
        expect(screen.getByTestId('vehicle-status').textContent).toBe('maintenance');
    });
});
