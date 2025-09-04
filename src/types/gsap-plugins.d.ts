// GSAP Plugin Type Declarations
declare module "gsap/ScrollTrigger" {
  import { ScrollTrigger } from "gsap";
  export = ScrollTrigger;
}

declare module "gsap/ScrollSmoother" {
  interface ScrollSmootherInstance {
    scrollTop(): number;
    scrollTop(value: number): ScrollSmootherInstance;
    scrollTo(
      target: string | number | Element,
      smooth?: boolean,
      position?: string
    ): ScrollSmootherInstance;
    offset(element: Element, position?: string): number;
    refresh(): ScrollSmootherInstance;
    normalizeScroll(enable: boolean): ScrollSmootherInstance;
    kill(): void;
    paused(): boolean;
    paused(value: boolean): ScrollSmootherInstance;
    progress(): number;
    progress(value: number): ScrollSmootherInstance;
    smooth(): number;
    smooth(value: number): ScrollSmootherInstance;
    effects(element: Element | string, speed: number): void;
  }

  interface ScrollSmootherConfig {
    wrapper?: string | Element;
    content?: string | Element;
    smooth?: number;
    effects?: boolean;
    smoothTouch?: boolean | number;
    normalizeScroll?: boolean;
    ignoreMobileResize?: boolean;
    onUpdate?: (self: ScrollSmootherInstance) => void;
    onRefresh?: (self: ScrollSmootherInstance) => void;
  }

  interface ScrollSmootherStatic {
    create(config: ScrollSmootherConfig): ScrollSmootherInstance;
    get(): ScrollSmootherInstance | undefined;
    refresh(): void;
    normalizeScroll(enable: boolean): void;
  }

  const ScrollSmoother: ScrollSmootherStatic;
  export = ScrollSmoother;
}

declare module "gsap/SplitText" {
  interface SplitTextInstance {
    chars: Element[];
    words: Element[];
    lines: Element[];
    revert(): void;
    split(config?: SplitTextConfig): SplitTextInstance;
  }

  interface SplitTextConfig {
    type?: "lines" | "words" | "chars" | string;
    linesClass?: string;
    wordsClass?: string;
    charsClass?: string;
    tag?: string;
    position?: "absolute" | "relative";
    wordDelimiter?: string;
    reduceWhiteSpace?: boolean;
  }

  interface SplitTextStatic {
    new (
      target: string | Element | Element[],
      config?: SplitTextConfig
    ): SplitTextInstance;
  }

  const SplitText: SplitTextStatic;
  export = SplitText;
}

declare module "gsap/TextPlugin" {
  const TextPlugin: object;
  export = TextPlugin;
}

declare module "gsap/MorphSVGPlugin" {
  interface MorphSVGPlugin {
    convertToPath(target: string | Element | Element[]): Element[];
    pathDataToBezier(
      path: string | Element,
      config?: {
        align?: Element | string;
        matrix?: any;
        offsetX?: number;
        offsetY?: number;
        x?: number;
        y?: number;
      }
    ): any[];
    pathFilter(
      a: any,
      b: any,
      shapeIndex: number,
      map: any,
      precompile: any
    ): any;
    stringToRawPath(path: string): any[];
    rawPathToString(rawPath: any[]): string;
    normalizeStrokes(strokes: any[]): any[];
    subdivideSegment(segment: any[], quantity: number): any[];
  }

  const MorphSVGPlugin: MorphSVGPlugin;
  export = MorphSVGPlugin;
}

declare module "gsap/DrawSVGPlugin" {
  const DrawSVGPlugin: object;
  export = DrawSVGPlugin;
}

declare module "gsap/MotionPathPlugin" {
  interface MotionPathPlugin {
    convertToPath(target: string | Element | Element[]): Element[];
    getPositionOnPath(
      path: string | Element,
      progress: number,
      includeAngle?: boolean
    ): { x: number; y: number; angle?: number };
    cacheRawPathMeasurements(rawPath: any[], resolution?: number): any[];
    getLength(path: string | Element): number;
    pointsToSegment(points: number[], curviness?: number): any[];
    rawPathToString(rawPath: any[]): string;
    stringToRawPath(path: string): any[];
  }

  const MotionPathPlugin: MotionPathPlugin;
  export = MotionPathPlugin;
}

// Extend GSAP types for better TypeScript support
declare module "gsap" {
  interface TweenVars {
    // ScrollTrigger integration
    scrollTrigger?: import("./gsap").ScrollTriggerConfig;

    // Text plugin
    text?: {
      value: string;
      delimiter?: string;
      speed?: number;
      diff?: boolean;
      padSpace?: boolean;
      newClass?: string;
      oldClass?: string;
    };

    // MorphSVG plugin
    morphSVG?:
      | string
      | Element
      | {
          shape: string | Element;
          shapeIndex?: number;
          map?: string;
          origin?: string;
        };

    // DrawSVG plugin
    drawSVG?:
      | string
      | boolean
      | { start?: string | number; end?: string | number };

    // MotionPath plugin
    motionPath?: {
      path: string | Element | any[];
      align?: string | Element;
      alignOrigin?: string;
      offsetX?: number;
      offsetY?: number;
      start?: number;
      end?: number;
      autoRotate?: boolean | number;
    };

    // Custom properties for better typing
    [key: string]: any;
  }

  interface Timeline {
    scrollTrigger?: import("gsap/ScrollTrigger");
  }

  namespace gsap {
    interface GlobalTimeline extends Timeline {}

    interface TweenTarget extends Element, string, object {}

    interface UtilsClass {
      // Add utility methods typing
      selector(selector: string): Element[];
      toArray(target: any): any[];
      shuffle(array: any[]): any[];
      distribute(config: {
        base?: number;
        amount?: number;
        from?: string | number;
        grid?: [number, number];
        axis?: string;
        ease?: string;
      }): (i: number, target: Element, a: Element[]) => number;
      wrap(min: number, max: number): (value: number) => number;
      wrap<T>(array: T[]): (index: number) => T;
      mapRange(
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
      ): (value: number) => number;
      pipe(...functions: Function[]): Function;
      unitize(func: Function, unit?: string): Function;
      normalize(min: number, max: number): (value: number) => number;
      getUnit(value: string): string;
      clamp(min: number, max: number): (value: number) => number;
      splitColor(color: string): number[];
      interpolate(start: any, end: any): (progress: number) => any;
      random(
        min?: number | any[],
        max?: number,
        snapTo?: number,
        returnFunction?: boolean
      ): number | Function;
    }
  }
}

// Global GSAP configuration augmentation
declare global {
  interface Window {
    gsap: typeof import("gsap").gsap;
    ScrollTrigger: typeof import("gsap/ScrollTrigger");
    ScrollSmoother: typeof import("gsap/ScrollSmoother");
    SplitText: typeof import("gsap/SplitText");
  }
}

export {};
