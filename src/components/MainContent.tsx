"use client";

import { useEffect } from "react";

export default function MainContent() {
  useEffect(() => {
    // This will be where we initialize GSAP and other client-side functionality
    // For now, just a placeholder to ensure the Next.js setup works
    console.log("MainContent mounted - ready for GSAP integration");
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-antonio font-bold">SPYLT</h1>
          <p className="text-xl">Next.js Foundation Setup Complete</p>
          <p className="text-gray-400">Ready for component migration</p>
        </div>
      </div>
    </main>
  );
}
