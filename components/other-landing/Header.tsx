"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthControls from "@/components/auth/AuthControls";
import Logo from "@/components/brand/Logo";
import { NAV } from "@/components/other-landing/content";
import { colors, focusRing, frame, type } from "@/components/other-landing/ui";

// The logo, the page's sections and the account. It sits on the page at the
// top and gains a white ground and a hairline once the page scrolls.
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-0 border-b border-solid transition-colors duration-300 ${
        scrolled ? `bg-white/90 backdrop-blur-md ${colors.line}` : "border-transparent bg-transparent"
      }`}
    >
      <div className={`${frame} flex h-16 items-center justify-between gap-6`}>
        <Link href="/" aria-label="Portory home" className={`${focusRing} rounded-[4px]`}>
          <Logo className="h-7 w-auto text-[#090909]" title={null} />
        </Link>
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="m-0 flex list-none gap-8 p-0">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`${focusRing} rounded-[4px] ${type.small} ${colors.body} no-underline transition-colors hover:text-[#090909]`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="[--foreground:#090909]">
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
