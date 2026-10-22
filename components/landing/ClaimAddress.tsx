"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Reveal } from "@/components/landing/Reveal";
import { displayTitle, kickerOnDark, lead, section, solidButton } from "@/components/landing/landing-ui";

// Content from the landing-redesign branch's "Claim your address" section.
const CLAIM = {
  kicker: "Your address",
  title: "Claim your portory.net address",
  text: "Every published portfolio gets its own link, ready for your CV, your email signature or your social profiles. You choose it when you publish.",
  domain: "portory.net/",
  placeholder: "your-name",
  button: "Get started",
  href: "/register",
};

// Lower case, letters, numbers and single hyphens: how an address reads.
const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").slice(0, 40);

// "Claim your portory.net address": type a name and see it as an address,
// then sign up. Nothing is reserved here; the address is chosen on publishing.
// It follows the FAQ, dark like the
// template wall and footer below it.
export default function ClaimAddress() {
  const router = useRouter();
  const [name, setName] = useState("");
  const slug = toSlug(name);

  return (
    <section aria-label={CLAIM.title} className={`${section} bg-foreground text-white md:py-32 [&_:focus-visible]:outline-white`}>
      <Reveal className="mx-auto flex w-content-width flex-col items-center gap-6 text-center">
        <p className={kickerOnDark}>{CLAIM.kicker}</p>
        <h2 className={`${displayTitle} text-white`}>{CLAIM.title}</h2>
        <p className={`${lead} max-w-[36rem] text-white/65`}>{CLAIM.text}</p>
        <form
          className="mt-4 flex w-full max-w-[40rem] flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(CLAIM.href);
          }}
        >
          <label className="flex h-14 min-w-0 items-center rounded border border-white/15 bg-white/[0.06] px-4 text-lg transition-colors focus-within:border-white/50 focus-within:bg-white/10 sm:flex-1">
            <span className="shrink-0 text-white/40">{CLAIM.domain}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={CLAIM.placeholder}
              aria-label="Your address"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-medium text-white outline-none placeholder:font-normal placeholder:text-white/25"
            />
          </label>
          <button type="submit" className={`${solidButton} h-14 px-8`}>
            {CLAIM.button}
          </button>
        </form>
        <p aria-live="polite" className="m-0 min-h-6 text-sm text-white/50">
          {slug && (
            <>
              Your page would live at <span className="font-medium text-white">{CLAIM.domain}{slug}</span>
            </>
          )}
        </p>
      </Reveal>
    </section>
  );
}
