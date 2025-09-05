"use client";

import React, { useState, FormEvent } from "react";
import { useMediaQuery } from "react-responsive";
import OptimizedImage from "@/components/OptimizedImage";
import OptimizedVideo from "@/components/OptimizedVideo";
import { FooterSectionProps, SocialLink } from "@/types/components";

// Default social links data
const defaultSocialLinks: SocialLink[] = [
  {
    id: "youtube",
    name: "YouTube",
    url: "https://youtube.com/@spylt",
    icon: "/images/yt.svg",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://instagram.com/spylt",
    icon: "/images/insta.svg",
  },
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://tiktok.com/@spylt",
    icon: "/images/tiktok.svg",
  },
];

const FooterSection: React.FC<FooterSectionProps> = ({
  socialLinks = defaultSocialLinks,
  newsletterConfig,
  copyrightText = "Copyright © 2025 Spylt - All Rights Reserved",
  className = "",
}) => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      if (newsletterConfig?.onSubmit) {
        await newsletterConfig.onSubmit(email);
        setSubmitMessage(
          newsletterConfig.successMessage || "Thank you for subscribing!"
        );
        setEmail("");
      } else {
        // Default behavior - just show success message
        setSubmitMessage("Thank you for subscribing!");
        setEmail("");
      }
    } catch {
      setSubmitMessage(
        newsletterConfig?.errorMessage ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
    }
  };

  const handleSocialClick = (link: SocialLink) => {
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={`footer-section ${className}`}>
      <OptimizedImage
        src="/images/footer-dip.png"
        alt="Footer decoration"
        width={1920}
        height={200}
        className="w-full object-cover -translate-y-1"
        priority={false}
        sizes="100vw"
      />

      <div className="2xl:h-[110dvh] relative md:pt-[20vh] pt-[10vh]">
        <div className="overflow-hidden z-10">
          <h1 className="general-title text-center text-milk py-5">
            #CHUGRESPONSIBLY
          </h1>
        </div>

        {isMobile ? (
          <OptimizedImage
            src="/images/footer-drink.png"
            alt="SPYLT drink bottle"
            width={400}
            height={600}
            className="absolute top-0 object-contain"
            priority={false}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <OptimizedVideo
            src="/videos/splash.mp4"
            autoPlay
            playsInline
            muted
            loop
            className="absolute top-0 object-contain mix-blend-lighten"
            width={800}
            height={600}
          />
        )}

        <div className="flex-center gap-5 relative z-10 md:mt-20 mt-5">
          {socialLinks.map((link) => (
            <button
              key={link.id}
              className="social-btn"
              onClick={() => handleSocialClick(link)}
              aria-label={`Visit our ${link.name} page`}
              type="button"
            >
              <OptimizedImage
                src={link.icon}
                alt={`${link.name} icon`}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>

        <div className="mt-40 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between text-milk font-paragraph md:text-lg font-medium">
          <div className="flex items-center md:gap-16 gap-5">
            <div>
              <p>SPYLT Flavors</p>
            </div>
            <div>
              <p>Chug Club</p>
              <p>Student Marketing</p>
              <p>Dairy Dealers</p>
            </div>
            <div>
              <p>Company</p>
              <p>Contacts</p>
              <p>Tasty Talk</p>
            </div>
          </div>

          <div className="md:max-w-lg">
            <p>
              Get Exclusive Early Access and Stay Informed About Product
              Updates, Events, and More!
            </p>
            <form onSubmit={handleNewsletterSubmit}>
              <div className="flex justify-between items-center border-b border-[#D9D9D9] py-5 md:mt-10">
                <input
                  type="email"
                  placeholder={
                    newsletterConfig?.placeholder || "Enter your email"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full placeholder:font-sans placeholder:text-[#999999] bg-transparent text-milk outline-none disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  aria-label="Subscribe to newsletter"
                  className="ml-2 disabled:opacity-50 hover:opacity-80 transition-opacity"
                >
                  <OptimizedImage
                    src="/images/arrow.svg"
                    alt="Submit"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              {submitMessage && (
                <p
                  className={`mt-2 text-sm ${
                    submitMessage.includes("wrong") ||
                    submitMessage.includes("error")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="copyright-box">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-7">
            <button
              type="button"
              className="hover:opacity-80 transition-opacity"
              onClick={() => window.open("/privacy-policy", "_blank")}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="hover:opacity-80 transition-opacity"
              onClick={() => window.open("/terms-of-service", "_blank")}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
