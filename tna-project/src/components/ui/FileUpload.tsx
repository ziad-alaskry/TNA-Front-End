import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className || ''}`}>
        {label && <label className="mb-1 text-sm font-medium text-gray-700 rtl:text-right">{label}</label>}
        <input
          type="file"
          ref={ref}
          className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500 rtl:text-right">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
