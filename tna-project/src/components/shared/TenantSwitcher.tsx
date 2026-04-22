import React from 'react';

export const TenantSwitcher = () => {
    return (
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
            <span>Tenant: Default</span>
            <i className="ph ph-caret-down text-xs"></i>
        </div>
    );
};
