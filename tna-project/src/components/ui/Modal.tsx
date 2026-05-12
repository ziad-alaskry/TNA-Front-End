import React, { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export default function Modal({ isOpen, onClose, title, children, footer, width = 'max-w-md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-brand-navy-dark/40 backdrop-blur-md overflow-y-auto overflow-x-hidden p-4 animate-in fade-in duration-fast">
      <div className={`relative bg-card rounded-xl shadow-popover w-full ${width} border border-divider animate-in zoom-in-95 duration-fast`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <h3 className="text-xl font-bold text-text-primary">
            {title}
          </h3>
          <button 
            type="button" 
            className="text-text-placeholder bg-transparent hover:bg-neutral-100 hover:text-text-primary rounded-lg text-sm w-10 h-10 ms-auto inline-flex justify-center items-center transition-colors"
            onClick={onClose}
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end p-6 border-t border-divider gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}