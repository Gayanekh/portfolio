import Link from "next/link";

const PortfolioNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-5 text-white mix-blend-difference">
      {/* Name */}
      <div className="text-[10px] sm:text-xs font-mono tracking-widest uppercase truncate pr-4">
        Gayane Khachatryan
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

        <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase whitespace-nowrap">
          Available for Work
        </span>
        <Link
          href="/templates?template=minimal&edit=1"
          className="ml-3 text-[10px] sm:text-xs font-mono tracking-widest uppercase whitespace-nowrap hover:opacity-60 transition-opacity duration-200"
        >
          Use Template
        </Link>
      </div>
    </nav>
  );
};

export default PortfolioNav;
