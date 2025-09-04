import React from "react";
import Image from "next/image";
import { NavBarProps } from "@/types/components";

const NavBar: React.FC<NavBarProps> = ({
  className = "",
  isScrolled: _isScrolled = false,
  onMenuToggle: _onMenuToggle,
  ...props
}) => {
  return (
    <nav
      className={`fixed top-0 left-0 z-50 md:p-9 p-3 ${className}`}
      {...props}
    >
      <Image
        src="/images/nav-logo.svg"
        alt="nav-logo"
        className="md:w-24 w-20"
        width={96}
        height={96}
        priority
        style={{
          width: "auto",
          height: "auto",
        }}
      />
    </nav>
  );
};

export default NavBar;
