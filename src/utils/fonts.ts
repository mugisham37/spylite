/**
 * Font utility functions for consistent font usage across the application
 */

export const fontClasses = {
  // Primary heading font (Antonio)
  heading: "font-antonio",

  // Body text font (ProximaNova)
  body: "font-paragraph",

  // Navigation font
  nav: "font-antonio",

  // Button font
  button: "font-antonio",

  // Caption font
  caption: "font-paragraph",
} as const;

export type FontClass = keyof typeof fontClasses;

/**
 * Get font class by type
 */
export const getFontClass = (type: FontClass): string => {
  return fontClasses[type];
};

/**
 * Combine font class with additional classes
 */
export const combineFontClass = (
  type: FontClass,
  additionalClasses?: string
): string => {
  const baseClass = getFontClass(type);
  return additionalClasses ? `${baseClass} ${additionalClasses}` : baseClass;
};

/**
 * Font weight utilities for consistent typography
 */
export const fontWeights = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
} as const;

export type FontWeight = keyof typeof fontWeights;

/**
 * Get font weight class
 */
export const getFontWeight = (weight: FontWeight): string => {
  return fontWeights[weight];
};

/**
 * Combine font type and weight
 */
export const getFontClassWithWeight = (
  type: FontClass,
  weight: FontWeight,
  additionalClasses?: string
): string => {
  const fontClass = getFontClass(type);
  const weightClass = getFontWeight(weight);
  const combined = `${fontClass} ${weightClass}`;
  return additionalClasses ? `${combined} ${additionalClasses}` : combined;
};
