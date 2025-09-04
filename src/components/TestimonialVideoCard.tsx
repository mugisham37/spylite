"use client";

import { useRef, useState, useCallback } from "react";
import OptimizedVideo from "./OptimizedVideo";
import type { TestimonialCardData } from "../constants";

interface TestimonialVideoCardProps {
  card: TestimonialCardData;
  index: number;
  className?: string;
  onPlay?: (index: number) => void;
  onPause?: (index: number) => void;
}

export const TestimonialVideoCard: React.FC<TestimonialVideoCardProps> = ({
  card,
  index,
  className = "",
  onPlay,
  onPause,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn(`Failed to play video for ${card.name}:`, error);
      });
      setIsPlaying(true);
      onPlay?.(index);
    }
  }, [card.name, index, onPlay]);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.(index);
    }
  }, [index, onPause]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    handlePlay();
  }, [handlePlay]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    handlePause();
  }, [handlePause]);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleVideoError = useCallback(() => {
    console.error(`Failed to load video for testimonial: ${card.name}`);
  }, [card.name]);

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Play testimonial video from ${card.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
        }
      }}
    >
      <OptimizedVideo
        ref={videoRef}
        src={card.src}
        poster={card.img}
        autoPlay={false}
        muted={true}
        loop={true}
        playsInline={true}
        controls={false}
        preload="metadata"
        className="size-full object-cover transition-transform duration-300 ease-out"
        style={{
          transform: isHovered ? "scale(1.02)" : "scale(1)",
        }}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onError={handleVideoError}
        lazy={true}
        threshold={0.1}
        rootMargin="100px"
      />

      {/* Video overlay with name */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-medium">{card.name}</p>
          <p className="text-xs opacity-75">
            {isPlaying ? "Playing" : "Hover to play"}
          </p>
        </div>
      </div>

      {/* Play/Pause indicator */}
      <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 rounded-full p-2">
          {isPlaying ? (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
