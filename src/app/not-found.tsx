"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-milk px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-mid-brown/10 rounded-full flex items-center justify-center">
            <span className="text-6xl font-antonio font-bold text-mid-brown">
              404
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-antonio font-bold text-dark-brown uppercase">
            Page Not Found
          </h1>
          <h2 className="text-xl font-antonio font-semibold text-dark-brown">
            Looks like this page got lost
          </h2>
          <p className="text-dark-brown/70 font-paragraph leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back to the good stuff – premium protein experiences
            await!
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-mid-brown hover:bg-light-brown text-white font-antonio font-bold rounded-full transition-all duration-200 uppercase"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 border-2 border-mid-brown text-mid-brown hover:bg-mid-brown hover:text-white font-antonio font-semibold rounded-full transition-all duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t border-dark-brown/10">
          <p className="text-sm text-dark-brown/60 font-paragraph mb-4">
            Popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/#flavors"
              className="text-mid-brown hover:text-light-brown underline font-paragraph"
            >
              Flavors
            </Link>
            <Link
              href="/#nutrition"
              className="text-mid-brown hover:text-light-brown underline font-paragraph"
            >
              Nutrition
            </Link>
            <Link
              href="/#benefits"
              className="text-mid-brown hover:text-light-brown underline font-paragraph"
            >
              Benefits
            </Link>
            <Link
              href="/#testimonials"
              className="text-mid-brown hover:text-light-brown underline font-paragraph"
            >
              Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
