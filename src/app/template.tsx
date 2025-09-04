"use client";

import { useEffect } from "react";
import { useGSAPContext } from "@/providers/GSAPProvider";

export default function Template({ children }: { children: React.ReactNode }) {
  const { refreshScrollTrigger } = useGSAPContext();

  useEffect(() => {
    // Refresh ScrollTrigger on route changes
    const timer = setTimeout(() => {
      refreshScrollTrigger();
    }, 100);

    return () => clearTimeout(timer);
  }, [refreshScrollTrigger]);

  return <div className="min-h-screen">{children}</div>;
}
