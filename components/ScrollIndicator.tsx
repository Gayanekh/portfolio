import { Progress } from "@/components/ui/progress";

interface ScrollIndicatorProps {
  progress: number;
}

const ScrollIndicator = ({ progress }: ScrollIndicatorProps) => {
  return (
    <div className="mt-12 transition-opacity duration-500">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono text-primary">
          {Math.round(progress)}%
        </p>
      </div>
      <Progress value={progress} className="h-[3px] bg-muted" />
    </div>
  );
};

export default ScrollIndicator;
