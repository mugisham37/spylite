"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class GSAPErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error("GSAP Error Boundary caught an error:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        this.props.fallback || (
          <div className="flex-center min-h-[200px] bg-milk border border-dark-brown rounded-lg p-8">
            <div className="col-center gap-4 text-center">
              <h3 className="text-dark-brown font-bold text-lg">
                Animation Error
              </h3>
              <p className="font-paragraph text-dark-brown text-sm max-w-md">
                There was an issue loading the animation. The content is still
                available below.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-light-brown text-dark-brown px-4 py-2 rounded-full font-bold text-sm hover:bg-mid-brown hover:text-milk transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
