"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ErrorContextType {
  errors: Record<string, string>;
  addError: (key: string, message: string) => void;
  removeError: (key: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useErrorHandler() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorProvider");
  }
  return context;
}

interface ErrorProviderProps {
  children: ReactNode;
}

export default function ErrorProvider({ children }: ErrorProviderProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addError = (key: string, message: string) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const removeError = (key: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError,
        removeError,
        clearErrors,
        hasErrors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
