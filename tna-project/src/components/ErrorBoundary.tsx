'use client';

import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; errorInfo?: string }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-100 p-4">
          <div className="max-w-md rounded border border-red-400 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-700">Something went wrong</h2>
            <p className="text-sm text-gray-600">{this.state.errorInfo || 'An unexpected error occurred.'}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
