import ScrollIndicator from "@/components/ScrollIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PortfolioAsideContent {
  label?: string;
  name?: string;
  about?: string;
  role?: string;
  location?: string;
  avatarSrc?: string;
  avatarFallback?: string;
}

interface PortfolioAsideProps {
  progress: number;
  content?: PortfolioAsideContent;
}

const PortfolioAside = ({ progress, content }: PortfolioAsideProps) => {
  const label = content?.label || "Portfolio";
  const name = content?.name || "Gayane Khachatryan";
  const about =
    content?.about ||
    "I design and build minimalist digital experiences focused on visual storytelling, motion, and clean interaction.";
  const role =
    content?.role ||
    "Senior UI/UX Designer & Design-to-Code Specialist | Scalable React Design Systems";
  const location = content?.location || "Yerevan, Armenia";
  const avatarSrc = content ? (content.avatarSrc || "").trim() : "/avatar.png";
  const avatarFallback = content?.avatarFallback || "A";

  return (
    <div
      id="about"
      className="w-full lg:max-w-[30%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-start lg:justify-end pt-4 sm:pt-6 lg:pt-0 pb-6 sm:pb-8 lg:pb-10 lg:pl-8 xl:pl-20 lg:pr-4 xl:pr-10 z-10 gap-10 sm:gap-12 lg:gap-32 xl:gap-30"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <Avatar className="h-24 w-24 sm:h-30 sm:w-30 lg:h-32 lg:w-32 border border-border">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback className="text-sm font-mono text-foreground/70">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
              {label}
            </p>
            <p className="text-2xl font-light tracking-tight text-foreground">
              {name}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
            About
          </p>
          <p className="text-sm leading-relaxed text-foreground/70 max-w-[320px]">
            {about}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Role
          </p>
          <p className="text-sm text-foreground/70">{role}</p>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Location
          </p>
          <p className="text-sm text-foreground/70">{location}</p>
        </div>
      </div>

      <ScrollIndicator progress={progress} />
    </div>
  );
};

export default PortfolioAside;
