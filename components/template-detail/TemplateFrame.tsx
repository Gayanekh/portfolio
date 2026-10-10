"use client";

import { useEffect, useState } from "react";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";

export const THEME_MESSAGE = "portory-template-theme";
// Sent by the frame once it can receive a theme.
export const READY_MESSAGE = "portory-template-ready";
export interface ThemeMessage {
  type: typeof THEME_MESSAGE;
  palette: string;
  font: string;
}

// The page shown inside the detail page's preview frame: the template alone,
// full size, with the palette and font pack the sidebar sends it. Running in
// its own frame keeps the template's responsive layout real on both devices.
export default function TemplateFrame({ id }: { id: string }) {
  const [theme, setTheme] = useState({ palette: "original", font: "original" });

  useEffect(() => {
    const receive = (event: MessageEvent<ThemeMessage>) => {
      if (event.origin !== window.location.origin || event.data?.type !== THEME_MESSAGE) return;
      setTheme({ palette: event.data.palette, font: event.data.font });
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: READY_MESSAGE }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  const Preview = getTemplateDetail(id)?.Preview;
  if (!Preview) return null;
  return (
    <div className={`${themeFontVariables} ${findPalette(theme.palette).className} ${findFontPack(theme.font).className} min-h-screen bg-card font-sans text-foreground`}>
      <Preview />
    </div>
  );
}
