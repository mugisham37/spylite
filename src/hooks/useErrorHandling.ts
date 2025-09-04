"use client";

import { useCallback } from "react";
import { useErrorHandler } from "@/components/providers/ErrorProvider";

export function useErrorHandling() {
  const { addError, removeError } = useErrorHandler();

  const handleMediaError = useCallback(
    (type: "image" | "video", src: string) => {
      const errorKey = `media-${type}-${src}`;
      const message = `Failed to load ${type}: ${src.split("/").pop()}`;
      addError(errorKey, message);
    },
    [addError]
  );

  const handleAnimationError = useCallback(
    (componentName: string, error: Error) => {
      const errorKey = `animation-${componentName}`;
      const message = `Animation error in ${componentName}: ${error.message}`;
      addError(errorKey, message);
    },
    [addError]
  );

  const handleSectionError = useCallback(
    (sectionName: string, error: Error) => {
      const errorKey = `section-${sectionName}`;
      const message = `Section error in ${sectionName}: ${error.message}`;
      addError(errorKey, message);
    },
    [addError]
  );

  const clearError = useCallback(
    (key: string) => {
      removeError(key);
    },
    [removeError]
  );

  return {
    handleMediaError,
    handleAnimationError,
    handleSectionError,
    clearError,
  };
}
