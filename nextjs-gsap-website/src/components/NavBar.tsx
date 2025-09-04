"use client";

import OptimizedImage from "./ui/OptimizedImage";
import { imageDimensions } from "@/lib/utils/imageOptimization";
import { NavBarProps } from "@/types/components";

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <nav className={`fixed top-0 left-0 z-50 md:p-9 p-3 ${className || ""}`}>
      <OptimizedImage
        src="/images/nav-logo.svg"
        alt="Navigation logo"
        width={96}
        height={96}
        className="md:w-24 w-20 h-auto"
        priority
        sizes={imageDimensions.logo.sizes}
        quality={95}
      />
    </nav>
  );
};

export default NavBar;
