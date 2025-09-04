"use client";

import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/LoadingStates";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dynamic imports for optimal code splitting and performance
const MainContent = dynamic(() => import("@/components/MainContent"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

export default function HomePage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("HomePage error:", error, errorInfo);
      }}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-milk">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-antonio font-bold text-dark-brown">
              Unable to Load SPYLT
            </h1>
            <p className="text-dark-brown/70 font-paragraph">
              Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-mid-brown hover:bg-light-brown text-white font-antonio font-semibold rounded-full transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <MainContent />
    </ErrorBoundary>
  );
}
