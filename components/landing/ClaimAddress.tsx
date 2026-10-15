"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Reveal } from "@/components/landing/Reveal";
import { displayTitle, kicker, lead, section, solidButton } from "@/components/landing/landing-ui";

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
export default function ClaimAddress() {
  const router = useRouter();
  const [name, setName] = useState("");
  const slug = toSlug(name);

  return (
    <section aria-label={CLAIM.title} className={`${section} bg-neutral-50 md:py-32`}>
      <Reveal className="mx-auto flex w-content-width flex-col items-center gap-6 text-center">
        <p className={kicker}>{CLAIM.kicker}</p>
        <h2 className={displayTitle}>{CLAIM.title}</h2>
        <p className={`${lead} max-w-[36rem]`}>{CLAIM.text}</p>
        <form
          className="mt-4 flex w-full max-w-[40rem] flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(CLAIM.href);
          }}
        >
          <label className="flex h-14 min-w-0 items-center rounded-md border border-black/20 bg-white px-4 text-lg focus-within:border-black sm:flex-1">
            <span className="shrink-0 text-neutral-400">{CLAIM.domain}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={CLAIM.placeholder}
              aria-label="Your address"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-medium text-black outline-none placeholder:font-normal placeholder:text-neutral-300"
            />
          </label>
          <button type="submit" className={`${solidButton} h-14 px-8`}>
            {CLAIM.button}
          </button>
        </form>
        <p aria-live="polite" className="m-0 min-h-6 text-sm text-neutral-500">
          {slug && (
            <>
              Your page would live at <span className="font-medium text-black">{CLAIM.domain}{slug}</span>
            </>
          )}
        </p>
      </Reveal>
    </section>
  );
}
