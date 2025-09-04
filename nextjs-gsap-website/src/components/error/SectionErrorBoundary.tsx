"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  sectionName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Section Error Boundary (${this.props.sectionName}) caught an error:`,
      error,
      errorInfo
    );
  }

  override render() {
    if (this.state.hasError) {
      const { sectionName = "Section" } = this.props;

      return (
        this.props.fallback || (
          <section className="min-h-screen flex-center bg-main-bg">
            <div className="col-center gap-6 text-center p-8 max-w-md">
              <div className="w-20 h-20 bg-dark-brown/10 rounded-full flex-center">
                <svg
                  className="w-10 h-10 text-dark-brown/50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-dark-brown font-bold text-xl mb-2">
                  {sectionName} Unavailable
                </h2>
                <p className="font-paragraph text-dark-brown/70 text-sm">
                  This section encountered an error and couldn&apos;t load
                  properly. You can continue browsing other parts of the site.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="bg-light-brown text-dark-brown px-4 py-2 rounded-full font-bold text-sm hover:bg-mid-brown hover:text-milk transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="border border-dark-brown text-dark-brown px-4 py-2 rounded-full font-bold text-sm hover:bg-dark-brown hover:text-milk transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </section>
        )
      );
    }

    return this.props.children;
  }
}
