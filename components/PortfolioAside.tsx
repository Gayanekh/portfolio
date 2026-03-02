import ScrollIndicator from "@/components/ScrollIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PortfolioAsideProps {
  progress: number;
}

const PortfolioAside = ({ progress }: PortfolioAsideProps) => {
  return (
    <div
      id="about"
      className="w-full lg:w-[40%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-start lg:justify-end pt-6 lg:pt-0 pb-6 lg:pb-20 lg:pl-10 xl:pl-20 lg:pr-6 xl:pr-10 z-10 gap-40"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <Avatar className="h-40 w-40 border border-border">
            <AvatarImage src="/avatar.png" alt="Gayane Khachatryan" />
            <AvatarFallback className="text-sm font-mono text-foreground/70">
              AG
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
              Portfolio
            </p>
            <p className="text-2xl font-light tracking-tight text-foreground">
              Gayane Khachatryan
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
            Senior UI/UX Designer & Design-to-Code Specialist | Scalable React
            Design Systems
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
