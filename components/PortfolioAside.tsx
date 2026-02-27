import ScrollIndicator from "@/components/ScrollIndicator";

interface PortfolioAsideProps {
  progress: number;
}

const PortfolioAside = ({ progress }: PortfolioAsideProps) => {
  return (
    <div className="w-[34%] sticky top-0 h-screen flex flex-col justify-end pb-20 pl-12 pr-10 z-10">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full border border-border bg-muted flex items-center justify-center text-sm font-mono text-foreground/70">
            AG
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
              Portfolio
            </p>
            <p className="text-2xl font-light tracking-tight text-foreground">
              Alex Gayane
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
            About
          </p>
          <p className="text-sm leading-relaxed text-foreground/70 max-w-[320px]">
            I design and build minimalist digital experiences focused on visual
            storytelling, motion, and clean interaction.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Role
          </p>
          <p className="text-sm text-foreground/70">
            Product Designer · Frontend Developer
          </p>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Location
          </p>
          <p className="text-sm text-foreground/70">Yerevan, Armenia</p>
        </div>
      </div>

      <ScrollIndicator progress={progress} />
    </div>
  );
};

export default PortfolioAside;
