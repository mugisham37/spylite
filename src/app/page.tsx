"use client";

import dynamic from "next/dynamic";

// Dynamic imports for optimal code splitting
const MainContent = dynamic(() => import("@/components/MainContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function HomePage() {
  return <MainContent />;
}
