// Import types from the centralized types directory
import type {
  FlavorData,
  NutrientData,
  CardData,
  BrandColors,
  TypographyConfig,
  SpacingConfig,
  BreakpointsConfig,
  AnimationTimingConfig,
} from "@/types/constants";

// Re-export types for backward compatibility
export type { FlavorData, NutrientData, CardData };

// Flavor lists data with comprehensive typing
export const flavorlists: readonly FlavorData[] = [
  {
    name: "Chocolate Milk",
    color: "brown",
    rotation: "md:rotate-[-8deg] rotate-0",
    description: "Rich and creamy chocolate flavor",
    ingredients: ["Milk", "Cocoa", "Sugar", "Natural Flavors"],
    availability: true,
    price: 4.99,
    sku: "SPYLT-CHOC-001",
  },
  {
    name: "Strawberry Milk", // Fixed typo
    color: "red",
    rotation: "md:rotate-[8deg] rotate-0",
    description: "Sweet strawberry goodness",
    ingredients: ["Milk", "Strawberry", "Sugar", "Natural Flavors"],
    availability: true,
    price: 4.99,
    sku: "SPYLT-STRW-001",
  },
  {
    name: "Cookies & Cream",
    color: "blue",
    rotation: "md:rotate-[-8deg] rotate-0",
    description: "Classic cookies and cream taste",
    ingredients: ["Milk", "Cookie Pieces", "Cream", "Natural Flavors"],
    availability: true,
    price: 5.49,
    sku: "SPYLT-COOK-001",
  },
  {
    name: "Peanut Butter Chocolate",
    color: "orange",
    rotation: "md:rotate-[8deg] rotate-0",
    description: "Perfect blend of peanut butter and chocolate",
    ingredients: ["Milk", "Peanut Butter", "Cocoa", "Natural Flavors"],
    availability: true,
    price: 5.49,
    sku: "SPYLT-PBCH-001",
  },
  {
    name: "Vanilla Milkshake",
    color: "white",
    rotation: "md:rotate-[-8deg] rotate-0",
    description: "Smooth vanilla milkshake flavor",
    ingredients: ["Milk", "Vanilla Extract", "Sugar", "Natural Flavors"],
    availability: true,
    price: 4.99,
    sku: "SPYLT-VANL-001",
  },
  {
    name: "Max Chocolate Milk",
    color: "black",
    rotation: "md:rotate-[8deg] rotate-0",
    description: "Maximum chocolate intensity",
    ingredients: ["Milk", "Dark Cocoa", "Sugar", "Natural Flavors"],
    availability: true,
    price: 5.99,
    sku: "SPYLT-MXCH-001",
  },
] as const;

// Nutrition lists data with enhanced typing
export const nutrientLists: readonly NutrientData[] = [
  {
    label: "Potassium",
    amount: "245mg",
    unit: "mg",
    dailyValue: 5,
    description: "Essential for muscle function",
    category: "mineral",
  },
  {
    label: "Calcium",
    amount: "500mg",
    unit: "mg",
    dailyValue: 38,
    description: "Builds strong bones and teeth",
    category: "mineral",
  },
  {
    label: "Vitamin A",
    amount: "176mcg",
    unit: "mcg",
    dailyValue: 20,
    description: "Supports healthy vision",
    category: "vitamin",
  },
  {
    label: "Vitamin D",
    amount: "5mcg",
    unit: "mcg",
    dailyValue: 25,
    description: "Helps calcium absorption",
    category: "vitamin",
  },
  {
    label: "Iron",
    amount: "1mg",
    unit: "mg",
    dailyValue: 6,
    description: "Essential for oxygen transport",
    category: "mineral",
  },
] as const;

// Testimonial cards data with enhanced typing
export const cards: readonly CardData[] = [
  {
    src: "/videos/f1.mp4",
    rotation: "rotate-z-[-10deg]",
    name: "Madison",
    img: "/images/p1.png",
    translation: "translate-y-[-5%]",
    quote: "SPYLT has completely changed my post-workout routine!",
    rating: 5,
    location: "California, USA",
    age: 24,
    occupation: "Fitness Trainer",
    verified: true,
    date: "2024-01-15",
  },
  {
    src: "/videos/f2.mp4",
    rotation: "rotate-z-[4deg]",
    name: "Alexander",
    img: "/images/p2.png",
    quote: "The taste is incredible and the protein content is perfect.",
    rating: 5,
    location: "New York, USA",
    age: 28,
    occupation: "Software Engineer",
    verified: true,
    date: "2024-01-20",
  },
  {
    src: "/videos/f3.mp4",
    rotation: "rotate-z-[-4deg]",
    name: "Andrew",
    img: "/images/p3.png",
    translation: "translate-y-[-5%]",
    quote: "Finally found a protein drink that doesn't taste chalky!",
    rating: 4,
    location: "Texas, USA",
    age: 32,
    occupation: "Personal Trainer",
    verified: true,
    date: "2024-01-25",
  },
  {
    src: "/videos/f4.mp4",
    rotation: "rotate-z-[4deg]",
    name: "Bryan",
    img: "/images/p4.png",
    translation: "translate-y-[5%]",
    quote: "Great for recovery after intense workouts.",
    rating: 5,
    location: "Florida, USA",
    age: 26,
    occupation: "Athlete",
    verified: true,
    date: "2024-02-01",
  },
  {
    src: "/videos/f5.mp4",
    rotation: "rotate-z-[-10deg]",
    name: "Chris",
    img: "/images/p5.png",
    quote: "Love the variety of flavors available!",
    rating: 4,
    location: "Colorado, USA",
    age: 30,
    occupation: "Nutritionist",
    verified: true,
    date: "2024-02-05",
  },
  {
    src: "/videos/f6.mp4",
    rotation: "rotate-z-[4deg]",
    name: "Devante",
    img: "/images/p6.png",
    translation: "translate-y-[5%]",
    quote: "Perfect for my busy lifestyle and fitness goals.",
    rating: 5,
    location: "Illinois, USA",
    age: 27,
    occupation: "Marketing Manager",
    verified: true,
    date: "2024-02-10",
  },
  {
    src: "/videos/f7.mp4",
    rotation: "rotate-z-[-3deg]",
    name: "Melisa",
    img: "/images/p7.png",
    translation: "translate-y-[10%]",
    quote: "Amazing taste and quality. Highly recommend!",
    rating: 5,
    location: "Washington, USA",
    age: 25,
    occupation: "Yoga Instructor",
    verified: true,
    date: "2024-02-15",
  },
] as const;

// Brand colors configuration
export const brandColors: BrandColors = {
  primary: {
    brown: "#8B4513",
    red: "#DC143C",
    blue: "#4169E1",
    orange: "#FF8C00",
    white: "#FFFFFF",
    black: "#000000",
  },
  secondary: {
    lightBrown: "#D2B48C",
    darkBrown: "#654321",
    cream: "#F5F5DC",
    milk: "#FEFCFF",
  },
  neutral: {
    gray100: "#F7FAFC",
    gray200: "#EDF2F7",
    gray300: "#E2E8F0",
    gray400: "#CBD5E0",
    gray500: "#A0AEC0",
    gray600: "#718096",
    gray700: "#4A5568",
    gray800: "#2D3748",
    gray900: "#1A202C",
  },
  semantic: {
    success: "#48BB78",
    warning: "#ED8936",
    error: "#F56565",
    info: "#4299E1",
  },
} as const;

// Typography configuration
export const typography: TypographyConfig = {
  fontFamilies: {
    primary:
      "'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    monospace:
      "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// Spacing configuration
export const spacing: SpacingConfig = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
  "3xl": "6rem",
  "4xl": "8rem",
  "5xl": "12rem",
  "6xl": "16rem",
} as const;

// Breakpoints configuration
export const breakpoints: BreakpointsConfig = {
  mobile: {
    min: 0,
    max: 767,
    query: "(max-width: 767px)",
  },
  tablet: {
    min: 768,
    max: 1535,
    query: "(min-width: 768px) and (max-width: 1535px)",
  },
  desktop: {
    min: 1536,
    max: 1919,
    query: "(min-width: 1536px) and (max-width: 1919px)",
  },
  wide: {
    min: 1920,
    max: Infinity,
    query: "(min-width: 1920px)",
  },
} as const;

// Animation timing configuration
export const animationTiming: AnimationTimingConfig = {
  durations: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.6,
    slower: 1.2,
  },
  easings: {
    linear: "linear",
    easeIn: "power2.in",
    easeOut: "power2.out",
    easeInOut: "power2.inOut",
    bounce: "bounce.out",
    elastic: "elastic.out(1, 0.3)",
    back: "back.out(1.7)",
  },
  delays: {
    none: 0,
    short: 0.1,
    medium: 0.3,
    long: 0.6,
  },
} as const;
