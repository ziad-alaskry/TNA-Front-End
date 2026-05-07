import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col space-y-1.5 ${className || ''}`}>
        {label && <label className="text-sm font-bold text-text-primary ps-1">{label}</label>}
        <input
          type="file"
          ref={ref}
          className={`w-full px-4 py-3 border rounded-md bg-card transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/10 ${
            error ? 'border-error ring-1 ring-error/20' : 'border-divider focus:border-primary'
          }`}
          {...props}
        />
        {error && <p className="text-xs text-error ps-1 font-medium">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
