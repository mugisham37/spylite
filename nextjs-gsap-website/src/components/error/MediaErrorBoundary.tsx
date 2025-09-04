"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  mediaType?: "image" | "video";
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class MediaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Media Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { mediaType = "media" } = this.props;

      return (
        this.props.fallback || (
          <div className="flex-center min-h-[300px] bg-main-bg border border-dark-brown/20 rounded-lg">
            <div className="col-center gap-3 text-center p-6">
              <div className="w-16 h-16 bg-dark-brown/10 rounded-full flex-center">
                {mediaType === "video" ? (
                  <svg
                    className="w-8 h-8 text-dark-brown/50"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 011-1h1a1 1 0 010 2H6a1 1 0 01-1-1zm6 1a1 1 0 100 2h3a1 1 0 100-2H11z" />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-dark-brown/50"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-dark-brown font-bold text-sm">
                {mediaType === "video"
                  ? "Video Unavailable"
                  : "Image Unavailable"}
              </h3>
              <p className="font-paragraph text-dark-brown/70 text-xs max-w-xs">
                The {mediaType} content could not be loaded. Please check your
                connection and try again.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-light-brown text-dark-brown px-3 py-1.5 rounded-full font-bold text-xs hover:bg-mid-brown hover:text-milk transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
