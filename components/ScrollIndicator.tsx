import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  progress: number;
}

const ScrollIndicator = ({ progress }: ScrollIndicatorProps) => {
  return (
    <div className="mt-12 transition-opacity duration-500">
      <div className="flex items-center justify-between mb-2">
        <motion.p
          key={Math.round(progress)}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-xs font-mono text-primary"
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
      <Progress value={progress} className="h-[2px] bg-muted" />
    </div>
  );
};

export default ScrollIndicator;
