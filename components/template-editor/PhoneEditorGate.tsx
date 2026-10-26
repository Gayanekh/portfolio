"use client";

import Link from "next/link";
import { useState } from "react";
import BackToHome from "@/components/BackToHome";
import LogoMark from "@/components/brand/LogoMark";
import LiveThumbnail from "@/components/template-detail/LiveThumbnail";
import { isLiveTemplate } from "@/components/template-detail/template-registry";
import { fluidText, focusRing, secondaryButton, solidButton } from "@/components/landing/landing-ui";

const wideButton = "h-12 w-full max-w-[20rem]";

// The editor needs a tablet or computer, so a phone first gets a short page:
// the template's preview (when it has a live one), Preview template (its
// demo), Back to templates, and "Open the editor anyway" for a quick check. The editor itself is already
// on the page, hidden on phones, so it opens at once. From sm up only the
// editor shows, as before.
export default function PhoneEditorGate({ id, name, demoHref, children }: { id: string; name: string; demoHref: string; children: React.ReactNode }) {
  const [anyway, setAnyway] = useState(false);

  return (
    <>
      {!anyway && (
        <div className="flex min-h-dvh flex-col bg-background text-foreground sm:hidden">
          <header className="flex min-h-11 items-center justify-between gap-3 px-4 pt-4">
            <Link href="/" aria-label="Portory home" className={`${focusRing} rounded`}>
              <LogoMark className="size-10" title={null} />
            </Link>
            <BackToHome href="/templates" label="Templates" />
          </header>

          <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-10 text-center">
            {isLiveTemplate(id) && (
              <div aria-hidden="true" className="relative aspect-[16/10] w-full max-w-[22rem] overflow-hidden rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
                <LiveThumbnail id={id} />
              </div>
            )}
            <h1 className={`${fluidText.editorTitle} m-0 mt-2 font-medium leading-tight tracking-[-0.03em]`}>Edit on a bigger screen</h1>
            <p className="m-0 max-w-[30ch] text-pretty text-[15px] leading-relaxed text-foreground/70">
              The {name} editor needs a tablet or computer. You can preview the template here and edit it later.
            </p>
            <div className="mt-2 flex w-full flex-col items-center gap-3">
              <Link href={demoHref} className={`${solidButton} ${wideButton}`}>
                Preview template
              </Link>
              <Link href="/templates" className={`${focusRing} ${secondaryButton} ${wideButton} inline-flex items-center justify-center rounded text-[0.95rem] font-medium no-underline`}>
                Back to templates
              </Link>
              <button type="button" onClick={() => setAnyway(true)} className={`${focusRing} mt-1 cursor-pointer rounded border-0 bg-transparent p-1 text-sm text-foreground/60 underline underline-offset-4 hover:text-foreground`}>
                Open the editor anyway
              </button>
            </div>
          </main>
        </div>
      )}
      <div className={anyway ? "contents" : "contents max-sm:hidden"}>{children}</div>
    </>
  );
}
