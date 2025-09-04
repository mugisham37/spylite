"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading SPYLT");

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev.endsWith("...")) {
          return "Loading SPYLT";
        }
        return prev + ".";
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-milk">
      <div className="flex flex-col items-center space-y-8">
        {/* SPYLT Logo/Brand */}
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-antonio font-bold text-dark-brown uppercase tracking-wider">
            SPYLT
          </h1>
          <div className="w-32 h-1 bg-mid-brown mx-auto mt-4 rounded-full">
            <div
              className="h-full bg-light-brown rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-dark-brown/20 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-mid-brown rounded-full animate-spin" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-dark-brown text-lg font-antonio font-medium min-h-[1.5rem]">
            {loadingText}
          </p>
          <p className="text-dark-brown/60 text-sm font-paragraph mt-2">
            Premium protein experience loading...
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <span className="text-dark-brown/40 text-sm font-paragraph">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
