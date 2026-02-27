const PortfolioNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
        Alex Morgan
      </div>
      <div className="flex items-center gap-8">
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
          href="#about"
          className="text-xs font-mono tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
        >
          About
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
        <span className="text-xs font-mono tracking-widest uppercase text-foreground">
          Available 2026
        </span>
      </div>
    </nav>
  );
};

export default PortfolioNav;
