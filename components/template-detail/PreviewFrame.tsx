"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { READY_MESSAGE, THEME_MESSAGE, type ThemeMessage } from "@/components/template-detail/TemplateFrame";
import { templateFrameHref, type TemplateDetail } from "@/components/template-detail/template-registry";
import { ease } from "@/components/landing/landing-ui";

export type Device = "desktop" | "mobile";

// Width the desktop preview is laid out at before it is scaled to fit.
const DESKTOP_WIDTH = 1280;

// The template in a browser window. A live template runs in its own frame,
// laid out at full desktop width and scaled down to fit (or at phone width on
// mobile); a placeholder shows its image. Palette and font changes are sent to
// the frame and fade the preview in, as in the reference.
export default function PreviewFrame({ template, device, palette, font }: { template: TemplateDetail; device: Device; palette: string; font: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [bodyRef, animate] = useAnimate<HTMLDivElement>();
  // The frame reloads when the device changes, so "loaded" belongs to a device.
  const [loadedFor, setLoadedFor] = useState<Device | null>(null);
  const loaded = loadedFor === device;
  const scale = useMotionValue(1);
  const frameHeight = useMotionValue(0);

  // Fit the frame to the window, now and whenever either changes size.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const fit = () => {
      const s = device === "desktop" ? body.clientWidth / DESKTOP_WIDTH : 1;
      scale.set(s);
      frameHeight.set(body.clientHeight / s);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(body);
    return () => observer.disconnect();
  }, [bodyRef, device, scale, frameHeight]);

  // Send the chosen style to the frame, and fade the preview back in.
  const send = () => {
    const message: ThemeMessage = { type: THEME_MESSAGE, palette, font };
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  };
  // A frame that has just (re)loaded asks for the current style.
  const onReadyRef = useRef(() => {});
  useEffect(() => {
    onReadyRef.current = () => {
      send();
      setLoadedFor(device);
    };
  });
  useEffect(() => {
    const onReady = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== READY_MESSAGE) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      onReadyRef.current();
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, []);

  const firstTheme = useRef(true);
  useEffect(() => {
    const message: ThemeMessage = { type: THEME_MESSAGE, palette, font };
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
    if (firstTheme.current) {
      firstTheme.current = false;
      return;
    }
    animate(bodyRef.current, { opacity: [0.2, 1] }, { duration: 0.6, ease });
  }, [palette, font, animate, bodyRef]);


  return (
    <motion.div
      layout
      transition={{ duration: 0.6, ease }}
      className={`flex h-[min(76vh,46rem)] flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_6px_rgb(0_0_0/0.05),0_30px_60px_-30px_rgb(0_0_0/0.3)] ring-1 ring-foreground/10 ${device === "desktop" ? "w-full max-w-[64rem]" : "w-[390px] max-w-full"}`}
    >
      <motion.div layout="position" aria-hidden="true" className="flex h-7 shrink-0 items-center gap-1.5 border-b border-foreground/5 px-3">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
      </motion.div>
      <div ref={bodyRef} className="relative min-h-0 flex-1 overflow-hidden bg-foreground/5">
        {template.Preview ? (
          <>
            <motion.iframe
              key={device}
              ref={frameRef}
              src={templateFrameHref(template.id)}
              title={`${template.name} template preview`}
              style={{ scale, height: frameHeight }}
              className={`absolute left-0 top-0 origin-top-left border-0 bg-white ${device === "desktop" ? "w-[1280px]" : "w-full"}`}
            />
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ opacity: loaded ? 0 : 1 }}
              transition={{ duration: 0.4, ease }}
              className="pointer-events-none absolute inset-0 animate-pulse bg-foreground/5"
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- remote placeholder photo
          <img src={template.image} alt={`${template.name} template preview`} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
    </motion.div>
  );
}
