import Link from "next/link";

const PortfolioNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(1rem,calc(0.304rem_+_2.857vw),2rem)] py-[clamp(1rem,calc(0.25rem_+_1.563vw),1.25rem)] text-white mix-blend-difference">
      {/* Name */}
      <div className="text-[length:clamp(0.625rem,calc(0.43rem_+_0.8vw),0.75rem)] font-mono tracking-widest uppercase truncate pr-4">
        Gayane Khachatryan
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-[clamp(1.5rem,calc(0rem_+_3.125vw),2rem)]">
        <a
          href="#works"
          className="text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
        >
          Featured Works
        </a>

        <a
          href="#archive"
          className="text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
        >
          Archive
        </a>

        <a
          href="#contact"
          className="text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
        >
          Contact
        </a>

        <a
          href="#about"
          className="text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
        >
          About
        </a>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Availability Indicator */}
        <span className="w-2 h-2 rounded-full bg-current inline-block animate-pulse" />

        <span className="text-[length:clamp(0.625rem,calc(0.43rem_+_0.8vw),0.75rem)] font-mono tracking-widest uppercase whitespace-nowrap">
          Available for Work
        </span>
        <Link
          href="/templates/editor/minimal"
          className="ml-3 text-[length:clamp(0.625rem,calc(0.43rem_+_0.8vw),0.75rem)] font-mono tracking-widest uppercase whitespace-nowrap hover:opacity-60 transition-opacity duration-200"
        >
          Use Template
        </Link>
      </div>
    </nav>
  );
};

export default PortfolioNav;
