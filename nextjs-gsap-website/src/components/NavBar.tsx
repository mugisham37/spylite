"use client";

import Image from "next/image";
import { NavBarProps } from "@/types/components";

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <nav className={`fixed top-0 left-0 z-50 md:p-9 p-3 ${className || ""}`}>
      <Image
        src="/images/nav-logo.svg"
        alt="nav-logo"
        width={96}
        height={96}
        className="md:w-24 w-20 h-auto"
        priority
      />
    </nav>
  );
};

export default NavBar;
