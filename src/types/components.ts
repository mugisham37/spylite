import {
  ReactNode,
  ComponentType,
  HTMLAttributes,
  VideoHTMLAttributes,
  ImgHTMLAttributes,
} from "react";
import { BaseComponentProps, SectionState } from "./common";
import {
  SectionAnimationConfig,
  TextAnimationConfig,
  VideoAnimationConfig,
} from "./gsap";

// Navigation component types
export interface NavBarProps extends BaseComponentProps {
  isScrolled?: boolean;
  onMenuToggle?: () => void;
}

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

// Hero section types
export interface HeroSectionProps extends BaseComponentProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  subtitle?: string;
  animationConfig?: SectionAnimationConfig;
}

export interface HeroVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onLoadedData?: () => void;
}

// Message section types
export interface MessageSectionProps extends BaseComponentProps {
  messages: MessageItem[];
  animationConfig?: TextAnimationConfig;
}

export interface MessageItem {
  id: string;
  text: string;
  delay?: number;
  duration?: number;
  ease?: string;
}

// Flavor section types
export interface FlavorSectionProps extends BaseComponentProps {
  animationConfig?: SectionAnimationConfig;
}

export interface FlavorData {
  id: string;
  name: string;
  color: string;
  rotation: string;
}

export interface FlavorSliderProps extends BaseComponentProps {
  flavors?: FlavorData[];
}

export interface FlavorTitleProps extends BaseComponentProps {
  animationConfig?: SectionAnimationConfig;
}

export interface FlavorCardProps {
  flavor: FlavorData;
  className?: string;
}

// Nutrition section types
export interface NutritionSectionProps extends BaseComponentProps {
  nutritionData?: NutritionData;
  animationConfig?: SectionAnimationConfig;
}

export interface NutritionData {
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  ingredients: string[];
  allergens: string[];
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
}

export interface NutritionCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

// Benefit section types
export interface BenefitSectionProps extends BaseComponentProps {
  benefits: BenefitItem[];
  videoSrc: string;
  animationConfig?: VideoAnimationConfig;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface VideoPinSectionProps {
  videoSrc: string;
  poster?: string;
  benefits: BenefitItem[];
  animationConfig?: VideoAnimationConfig;
}

// Testimonial section types
export interface TestimonialSectionProps extends BaseComponentProps {
  testimonials?: TestimonialItem[];
  animationConfig?: SectionAnimationConfig;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
  videoSrc?: string;
  videoPoster?: string;
}

export interface TestimonialCardProps {
  testimonial: TestimonialItem;
  isActive?: boolean;
  onClick?: () => void;
}

// Video testimonial card types (TestimonialCardData imported from constants)
export interface TestimonialVideoCardProps {
  card: {
    id: string;
    src: string;
    rotation: string;
    name: string;
    img: string;
    translation?: string;
  };
  index: number;
  className?: string;
  onPlay?: (index: number) => void;
  onPause?: (index: number) => void;
}

// Footer section types
export interface FooterSectionProps extends BaseComponentProps {
  socialLinks?: SocialLink[];
  newsletterConfig?: NewsletterConfig;
  copyrightText?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface NewsletterConfig {
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

// Optimized asset components
export interface OptimizedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
}

export interface OptimizedVideoProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  lazy?: boolean;
  onIntersection?: (isIntersecting: boolean) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
}

// Layout components
export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export interface SectionWrapperProps extends BaseComponentProps {
  as?: keyof React.JSX.IntrinsicElements;
  fullHeight?: boolean;
  centered?: boolean;
  animationConfig?: SectionAnimationConfig;
  state?: SectionState;
}

// Animation wrapper components
export interface AnimatedSectionProps extends BaseComponentProps {
  animationConfig: SectionAnimationConfig;
  children: ReactNode;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
}

export interface AnimatedTextProps extends BaseComponentProps {
  text: string;
  animationConfig: TextAnimationConfig;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  onAnimationComplete?: () => void;
}

// Error boundary component
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorBoundaryFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

// Loading component
export interface LoadingProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  variant?: "spinner" | "dots" | "pulse";
  text?: string;
}

// Button component
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

// Form components
export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
}

export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  rows?: number;
}

// Modal component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Tooltip component
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  delay?: number;
}

// Carousel component
export interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  infinite?: boolean;
  onSlideChange?: (index: number) => void;
}

// Accordion component
export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

// Tabs component
export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}
