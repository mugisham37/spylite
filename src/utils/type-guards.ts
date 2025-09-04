// Type guard utilities for runtime type checking

/**
 * Checks if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Checks if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Checks if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Checks if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Checks if a value is an object (excluding null and arrays)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is an array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

/**
 * Checks if a value is a DOM element
 */
export function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

/**
 * Checks if a value is an HTML element
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

/**
 * Checks if a value is a video element
 */
export function isVideoElement(value: unknown): value is HTMLVideoElement {
  return value instanceof HTMLVideoElement;
}

/**
 * Checks if a value is an image element
 */
export function isImageElement(value: unknown): value is HTMLImageElement {
  return value instanceof HTMLImageElement;
}

/**
 * Checks if a value is a valid CSS selector string
 */
export function isCSSSelector(value: unknown): value is string {
  if (!isString(value)) return false;

  try {
    document.querySelector(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a value is a valid URL string
 */
export function isValidURL(value: unknown): value is string {
  if (!isString(value)) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a value is a valid email string
 */
export function isValidEmail(value: unknown): value is string {
  if (!isString(value)) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Checks if a value has a specific property
 */
export function hasProperty<T extends object, K extends string>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return prop in obj;
}

/**
 * Checks if a value has all required properties
 */
export function hasRequiredProperties<T extends object, K extends string>(
  obj: T,
  props: K[]
): obj is T & Record<K, unknown> {
  return props.every((prop) => hasProperty(obj, prop));
}

/**
 * Type guard for GSAP timeline objects
 */
export function isGSAPTimeline(value: unknown): value is gsap.core.Timeline {
  return (
    isObject(value) &&
    hasProperty(value, "play") &&
    hasProperty(value, "pause") &&
    hasProperty(value, "kill") &&
    isFunction(value.play) &&
    isFunction(value.pause) &&
    isFunction(value.kill)
  );
}

/**
 * Type guard for ScrollTrigger instances
 */
export function isScrollTrigger(value: unknown): value is ScrollTrigger {
  return (
    isObject(value) &&
    hasProperty(value, "trigger") &&
    hasProperty(value, "start") &&
    hasProperty(value, "end") &&
    hasProperty(value, "refresh") &&
    isFunction(value.refresh)
  );
}

/**
 * Type guard for React components
 */
export function isReactComponent(value: unknown): value is React.ComponentType {
  return isFunction(value) || (isObject(value) && hasProperty(value, "render"));
}

/**
 * Type guard for React elements
 */
export function isReactElement(value: unknown): value is React.ReactElement {
  return (
    isObject(value) &&
    hasProperty(value, "type") &&
    hasProperty(value, "props") &&
    hasProperty(value, "key")
  );
}

/**
 * Checks if a value is a valid breakpoint
 */
export function isValidBreakpoint(
  value: unknown
): value is "mobile" | "tablet" | "desktop" | "large" {
  return (
    isString(value) && ["mobile", "tablet", "desktop", "large"].includes(value)
  );
}

/**
 * Checks if a value is a valid animation easing
 */
export function isValidEasing(value: unknown): value is string {
  if (!isString(value)) return false;

  const validEasings = [
    "none",
    "power1",
    "power2",
    "power3",
    "power4",
    "back",
    "bounce",
    "circ",
    "elastic",
    "expo",
    "sine",
    "linear",
  ];

  return (
    validEasings.some((easing) => value.includes(easing)) ||
    /^cubic-bezier\([\d\s.,]+\)$/.test(value)
  );
}

/**
 * Assertion function that throws if condition is false
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Assertion function for defined values
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  assert(isDefined(value), message || "Value must be defined");
}

/**
 * Assertion function for non-empty strings
 */
export function assertNonEmptyString(
  value: unknown,
  message?: string
): asserts value is string {
  assert(
    isString(value) && value.length > 0,
    message || "Value must be a non-empty string"
  );
}

/**
 * Assertion function for positive numbers
 */
export function assertPositiveNumber(
  value: unknown,
  message?: string
): asserts value is number {
  assert(
    isNumber(value) && value > 0,
    message || "Value must be a positive number"
  );
}

/**
 * Creates a type predicate function for checking object shapes
 */
export function createShapeValidator<T extends Record<string, unknown>>(shape: {
  [K in keyof T]: (value: unknown) => value is T[K];
}) {
  return (value: unknown): value is T => {
    if (!isObject(value)) return false;

    return Object.entries(shape).every(([key, validator]) => {
      const propValue = (value as any)[key];
      return validator(propValue);
    });
  };
}

/**
 * Exhaustive check for union types
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

/**
 * Safe JSON parsing with type validation
 */
export function safeJSONParse<T>(
  json: string,
  validator: (value: unknown) => value is T
): T | null {
  try {
    const parsed = JSON.parse(json);
    return validator(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
