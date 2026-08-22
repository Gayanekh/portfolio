interface PortfolioNavProps {
  templateLabel?: string;
  onTemplateClick?: () => void;
  templateHref?: string;
}

const PortfolioNav = ({
  templateLabel = "Use Template",
  onTemplateClick,
  templateHref = "/template",
}: PortfolioNavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-5  ">
      <div className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-widest uppercase truncate pr-4">
        Gayane Khachatryan
      </div>
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <a
          href="#works"
          className="text-xs font-mono tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
        >
          Featured Works
        </a>
        <a
          href="#archive"
          className="text-xs font-mono tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
        >
          Archive
        </a>
        <a
          href="#contact"
          className="text-xs font-mono tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
        >
          Contact
        </a>
        <a
          href="#about"
          className="text-xs font-mono tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
        >
          About
        </a>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onTemplateClick ? (
          <button
            type="button"
            onClick={onTemplateClick}
            className="hidden sm:inline-flex text-[10px] sm:text-xs font-mono tracking-widest uppercase border border-border px-3 py-1.5 text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors duration-200"
          >
            {templateLabel}
          </button>
        ) : (
          <a
            href={templateHref}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex text-[10px] sm:text-xs font-mono tracking-widest uppercase border border-border px-3 py-1.5 text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors duration-200"
          >
            {templateLabel}
          </a>
        )}
        <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
        <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-foreground whitespace-nowrap">
          Available 2026
        </span>
      </div>
    </nav>
  );
};

export default PortfolioNav;
