// Component prop interfaces
import { ReactNode } from "react";
import { AnimationConfig } from "./gsap";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

// Animation component props
export interface AnimatedComponentProps extends BaseComponentProps {
  animationConfig?: AnimationConfig;
  disabled?: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onAnimationError?: (error: Error) => void;
}

// Section component props
export interface SectionProps extends AnimatedComponentProps {
  background?: string;
  padding?: string;
  margin?: string;
  fullHeight?: boolean;
}

// Title component props
export interface ClipPathTitleProps extends AnimatedComponentProps {
  title: string;
  color: string;
  bg: string;
  borderColor: string;
  animationDelay?: number;
  splitType?: "chars" | "words" | "lines";
}

// Video pin section props
export interface VideoPinSectionProps extends AnimatedComponentProps {
  videoSrc?: string;
  posterSrc?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  pinDuration?: string;
  pinSpacing?: boolean;
}

// Hero section props
export interface HeroSectionProps extends SectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  backgroundVideo?: string;
  backgroundImage?: string;
  heroImage?: string;
  onButtonClick?: () => void;
}

// Message section props
export interface MessageSectionProps extends SectionProps {
  title?: string;
  message?: string;
  backgroundImage?: string;
  textColor?: string;
  backgroundColor?: string;
}

// Flavor section props
export interface FlavorSectionProps extends SectionProps {
  flavors?: FlavorItem[];
  enableHorizontalScroll?: boolean;
  scrollSpeed?: number;
}

export interface FlavorItem {
  name: string;
  color: "brown" | "red" | "blue" | "orange" | "white" | "black";
  rotation: string;
  image?: string;
  description?: string;
}

// Flavor slider props
export interface FlavorSliderProps extends AnimatedComponentProps {
  flavors: FlavorItem[];
  currentIndex?: number;
  onFlavorChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

// Flavor title props
export interface FlavorTitleProps extends AnimatedComponentProps {
  flavor: FlavorItem;
  isActive?: boolean;
  onClick?: () => void;
}

// Nutrition section props
export interface NutritionSectionProps extends SectionProps {
  nutrients?: NutrientItem[];
  backgroundImage?: string;
  title?: string;
  description?: string;
}

export interface NutrientItem {
  label: string;
  amount: string;
  unit?: string;
  description?: string;
}

// Benefit section props
export interface BenefitSectionProps extends SectionProps {
  benefits?: BenefitItem[];
  videoSrc?: string;
  title?: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

// Testimonial section props
export interface TestimonialSectionProps extends SectionProps {
  testimonials?: TestimonialCard[];
  autoPlay?: boolean;
  showControls?: boolean;
}

export interface TestimonialCard {
  src: string;
  rotation: string;
  name: string;
  img: string;
  translation?: string;
  quote?: string;
  rating?: number;
}

// Footer section props
export interface FooterSectionProps extends SectionProps {
  logo?: string;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
  newsletter?: boolean;
}

export interface SocialLink {
  platform: "instagram" | "tiktok" | "youtube" | "facebook" | "twitter";
  url: string;
  icon?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

// Navigation props
export interface NavBarProps extends BaseComponentProps {
  logo?: string;
  menuItems?: MenuItem[];
  sticky?: boolean;
  transparent?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
  submenu?: MenuItem[];
}

// UI Component props
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

export interface ErrorNotificationProps extends BaseComponentProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export interface NoScriptFallbackProps extends BaseComponentProps {
  message?: string;
  showImage?: boolean;
  imageSrc?: string;
}

export interface SafeSectionProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

// Media component props (extending base media types)
export interface MediaLoaderProps extends BaseComponentProps {
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface VideoLoaderProps extends MediaLoaderProps {
  src: string;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
}

export interface ImageLoaderProps extends MediaLoaderProps {
  src: string;
  alt: string;
  priority?: boolean;
}

// Provider props
export interface GSAPProviderProps extends BaseComponentProps {
  config?: AnimationConfig;
  enableDebug?: boolean;
  onError?: (error: Error) => void;
}

export interface ErrorProviderProps extends BaseComponentProps {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallback?: ReactNode;
}

// Error boundary props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

// Form component props
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: Record<string, unknown>) => void;
  validation?: ValidationSchema;
  loading?: boolean;
  disabled?: boolean;
}

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean | string;
  };
}

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}
