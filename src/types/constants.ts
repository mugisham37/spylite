// Constants and data model types

// Flavor data model (extending existing)
export interface FlavorData {
  name: string;
  color: "brown" | "red" | "blue" | "orange" | "white" | "black";
  rotation: string;
  image?: string;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: NutritionFacts;
  availability?: boolean;
  price?: number;
  sku?: string;
}

// Nutrition data model (extending existing)
export interface NutrientData {
  label: string;
  amount: string;
  unit?: string;
  dailyValue?: number;
  description?: string;
  category?: "vitamin" | "mineral" | "macronutrient" | "other";
}

// Comprehensive nutrition facts
export interface NutritionFacts {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  totalFat: NutrientData;
  saturatedFat: NutrientData;
  transFat: NutrientData;
  cholesterol: NutrientData;
  sodium: NutrientData;
  totalCarbohydrates: NutrientData;
  dietaryFiber: NutrientData;
  totalSugars: NutrientData;
  addedSugars: NutrientData;
  protein: NutrientData;
  vitamins: NutrientData[];
  minerals: NutrientData[];
  other?: NutrientData[];
}

// Testimonial card data model (extending existing)
export interface CardData {
  src: string;
  rotation: string;
  name: string;
  img: string;
  translation?: string;
  quote?: string;
  rating?: number;
  location?: string;
  age?: number;
  occupation?: string;
  verified?: boolean;
  date?: string;
  socialHandle?: string;
}

// Brand colors configuration
export interface BrandColors {
  primary: {
    brown: string;
    red: string;
    blue: string;
    orange: string;
    white: string;
    black: string;
  };
  secondary: {
    lightBrown: string;
    darkBrown: string;
    cream: string;
    milk: string;
  };
  neutral: {
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Typography configuration
export interface TypographyConfig {
  fontFamilies: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
  };
  fontWeights: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeights: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

// Spacing configuration
export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
}

// Breakpoints configuration
export interface BreakpointsConfig {
  mobile: {
    min: number;
    max: number;
    query: string;
  };
  tablet: {
    min: number;
    max: number;
    query: string;
  };
  desktop: {
    min: number;
    max: number;
    query: string;
  };
  wide: {
    min: number;
    max: number;
    query: string;
  };
}

// Animation timing configuration
export interface AnimationTimingConfig {
  durations: {
    fast: number;
    normal: number;
    slow: number;
    slower: number;
  };
  easings: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
    back: string;
  };
  delays: {
    none: number;
    short: number;
    medium: number;
    long: number;
  };
}

// Social media configuration
export interface SocialMediaConfig {
  platforms: {
    instagram: {
      name: string;
      url: string;
      icon: string;
      color: string;
    };
    tiktok: {
      name: string;
      url: string;
      icon: string;
      color: string;
    };
    youtube: {
      name: string;
      url: string;
      icon: string;
      color: string;
    };
    facebook: {
      name: string;
      url: string;
      icon: string;
      color: string;
    };
    twitter: {
      name: string;
      url: string;
      icon: string;
      color: string;
    };
  };
}

// API endpoints configuration
export interface APIEndpoints {
  base: string;
  products: string;
  nutrition: string;
  testimonials: string;
  contact: string;
  newsletter: string;
  analytics: string;
}

// Feature flags
export interface FeatureFlags {
  enableAnimations: boolean;
  enableVideoAutoplay: boolean;
  enableLazyLoading: boolean;
  enableAnalytics: boolean;
  enableNewsletterSignup: boolean;
  enableSocialSharing: boolean;
  enableAccessibilityMode: boolean;
  enableDebugMode: boolean;
}

// Application configuration
export interface AppConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
  };
  colors: BrandColors;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  breakpoints: BreakpointsConfig;
  animations: AnimationTimingConfig;
  socialMedia: SocialMediaConfig;
  api: APIEndpoints;
  features: FeatureFlags;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    twitterCard: string;
  };
}

// Environment configuration
export interface EnvironmentConfig {
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_ANALYTICS_ID?: string;
  NEXT_PUBLIC_GTM_ID?: string;
  NEXT_PUBLIC_SENTRY_DSN?: string;
}

// Asset paths configuration
export interface AssetPaths {
  images: {
    hero: string;
    products: string;
    backgrounds: string;
    icons: string;
    testimonials: string;
  };
  videos: {
    hero: string;
    products: string;
    testimonials: string;
    backgrounds: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
}

// Content configuration
export interface ContentConfig {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
  };
  sections: {
    message: {
      title: string;
      content: string;
    };
    flavors: {
      title: string;
      description: string;
    };
    nutrition: {
      title: string;
      description: string;
    };
    benefits: {
      title: string;
      description: string;
    };
    testimonials: {
      title: string;
      description: string;
    };
  };
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}
