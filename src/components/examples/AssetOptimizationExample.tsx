"use client";

import OptimizedImage from "../OptimizedImage";
import OptimizedVideo from "../OptimizedVideo";
import {
  imageSizes,
  videoSettings,
  imageQuality,
  buildAssetUrl,
} from "@/utils/assets";
import { getFontClassWithWeight } from "@/utils/fonts";

/**
 * Example component demonstrating proper usage of optimized assets
 * This serves as a reference for implementing asset optimization throughout the app
 */
const AssetOptimizationExample = () => {
  return (
    <div className="space-y-8 p-8">
      {/* Hero Image Example */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Hero Image (Priority Loading)
        </h2>
        <OptimizedImage
          src={buildAssetUrl("images", "hero-background.jpg")}
          alt="SPYLT Hero Background"
          width={1920}
          height={1080}
          priority={true}
          quality={imageQuality.hero}
          sizes={imageSizes.hero}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </section>

      {/* Card Images Example */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Card Images (Lazy Loading)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <OptimizedImage
              key={index}
              src={buildAssetUrl("images", `flavor-${index}.jpg`)}
              alt={`Flavor ${index}`}
              width={400}
              height={300}
              quality={imageQuality.medium}
              sizes={imageSizes.card}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* Hero Video Example */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Hero Video (Auto-play, No Lazy Loading)
        </h2>
        <OptimizedVideo
          src={buildAssetUrl("videos", "hero-video.mp4")}
          poster={buildAssetUrl("images", "hero-poster.jpg")}
          className="w-full h-[400px] object-cover rounded-lg"
          {...videoSettings.hero}
        />
      </section>

      {/* Background Video Example */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Background Video (Lazy Loading)
        </h2>
        <OptimizedVideo
          src={buildAssetUrl("videos", "background-video.mp4")}
          poster={buildAssetUrl("images", "background-poster.jpg")}
          className="w-full h-[300px] object-cover rounded-lg"
          {...videoSettings.background}
        />
      </section>

      {/* Content Video Example */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Content Video (User Controls)
        </h2>
        <OptimizedVideo
          src={buildAssetUrl("videos", "content-video.mp4")}
          poster={buildAssetUrl("images", "content-poster.jpg")}
          className="w-full h-[300px] object-cover rounded-lg"
          {...videoSettings.content}
        />
      </section>

      {/* Typography Examples */}
      <section>
        <h2
          className={getFontClassWithWeight("heading", "bold", "text-2xl mb-4")}
        >
          Typography Examples
        </h2>
        <div className="space-y-4">
          <h1 className={getFontClassWithWeight("heading", "bold", "text-4xl")}>
            Antonio Heading Font
          </h1>
          <p className={getFontClassWithWeight("body", "normal", "text-lg")}>
            This is ProximaNova body text. It provides excellent readability and
            complements the Antonio heading font perfectly.
          </p>
          <button
            className={getFontClassWithWeight(
              "button",
              "semibold",
              "px-6 py-3 bg-red text-white rounded-lg"
            )}
          >
            Antonio Button Text
          </button>
        </div>
      </section>
    </div>
  );
};

export default AssetOptimizationExample;
