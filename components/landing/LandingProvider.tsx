"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import TemplatePreviewDialog from "@/components/landing/TemplatePreviewDialog";
import type { PersonKey, TemplateId } from "@/components/landing/sample-portfolios";

interface LandingState {
  motionReduced: boolean;
  setMotionReduced: (reduced: boolean) => void;
  openPreview: (template: TemplateId, person: PersonKey) => void;
}

const LandingContext = createContext<LandingState | null>(null);
const MOTION_KEY = "portory-motion";
const MOTION_EVENT = "portory-motion-change";
// Fallback when storage is unavailable (e.g. private mode).
let memoryReduced = false;

const subscribeMotion = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(MOTION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(MOTION_EVENT, onChange);
  };
};
const readMotion = () => {
  try {
    const stored = localStorage.getItem(MOTION_KEY);
    return stored === null ? memoryReduced : stored === "off";
  } catch {
    return memoryReduced;
  }
};

export function useLanding() {
  const value = useContext(LandingContext);
  if (!value) throw new Error("useLanding must be used inside LandingProvider");
  return value;
}

// Holds the footer's "Reduce motion" choice (on top of the OS setting) and the
// shared template preview dialog.
export default function LandingProvider({ children }: { children: React.ReactNode }) {
  const motionReduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const [preview, setPreview] = useState<{ template: TemplateId; person: PersonKey } | null>(null);

  const setMotionReduced = useCallback((reduced: boolean) => {
    memoryReduced = reduced;
    try {
      localStorage.setItem(MOTION_KEY, reduced ? "off" : "on");
    } catch {
      // Not persisted; the in-memory choice still applies for this visit.
    }
    window.dispatchEvent(new Event(MOTION_EVENT));
  }, []);

  const openPreview = useCallback((template: TemplateId, person: PersonKey) => setPreview({ template, person }), []);

  return (
    <LandingContext.Provider value={{ motionReduced, setMotionReduced, openPreview }}>
      <MotionConfig reducedMotion={motionReduced ? "always" : "user"}>
        {children}
        <TemplatePreviewDialog
          open={preview !== null}
          template={preview?.template ?? "atelier"}
          person={preview?.person ?? "amara"}
          onChange={(next) => setPreview(next)}
          onClose={() => setPreview(null)}
        />
      </MotionConfig>
    </LandingContext.Provider>
  );
}
