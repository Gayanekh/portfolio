"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AvatarCta from "@/components/landing/AvatarCta";
import { sectionCard } from "@/components/landing/Section";
import illustration from "@/public/images/auth/a_clean_modern_3d_cgi_style_illustration_on_a_tr.png";
import { ease, focusRing } from "@/components/landing/landing-ui";

export default function LandingHero() {
  const reduced = useReducedMotionConfig();

  return (
    <>
      <div id="hero">
        <section aria-label="Hero section" className="relative flex h-fit items-center pb-20 pt-[7.5rem] md:min-h-svh md:pb-16 md:pt-28">
          <div className="w-content-width mx-auto">
            <div className={`${sectionCard} overflow-visible`}>
              <div className="flex w-full flex-col items-center gap-10 md:flex-row md:gap-x-16 lg:gap-x-20 xl:gap-x-28">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease }}
                  className="relative z-40 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] justify-items-center gap-[1.375rem] text-center md:w-auto md:flex-1 md:justify-items-start md:text-left"
                >
                  <h1 className="m-0 mt-1 text-balance text-[length:clamp(1.75rem,11vw,2.875rem)] leading-[0.96] tracking-[-0.05em] text-foreground [overflow-wrap:anywhere] md:text-[length:clamp(2.125rem,4vw,3.625rem)]">
                    <span className="">Your work has a story.</span>{" "}
                    <span className="font-bold">Show it with Portory.</span>
                  </h1>
                  <p className="m-0 max-w-[30em] text-[1.0625rem] leading-normal text-muted-foreground [overflow-wrap:anywhere]">
                    <span className="font-medium text-foreground">Choose a template, add your details and work samples, and publish your portfolio at your own portory.net address.</span>{" "}
                    Keep editing whenever you like, even after it&apos;s live.
                  </p>
                  <div className="mt-1.5 flex max-w-full flex-wrap items-center justify-center gap-3 [overflow-wrap:anywhere] md:justify-start">
                    <AvatarCta id="hero-cta" href="/templates" label="Create Your Portfolio" />
                    <Link
                      href="/templates"
                      className={`${focusRing} group inline-flex min-h-12 max-w-full items-center gap-2 rounded-full border border-border bg-white/85 px-5 text-[0.90625rem] font-medium text-foreground no-underline transition-[border-color,background-color,transform] duration-200 hover:border-foreground/15 hover:bg-white active:scale-[0.97] motion-reduce:transition-none`}
                    >
                      Explore Templates
                      <ArrowRight aria-hidden="true" strokeWidth={2} className="size-4 transition-transform duration-300 group-hover:translate-x-[3px] motion-reduce:transition-none" />
                    </Link>
                  </div>
                  <p className="m-0 max-w-[32em] text-[0.875rem] leading-normal text-muted-foreground [overflow-wrap:anywhere]">
                    Made for teachers, photographers, consultants, nurses, engineers, researchers and anyone else whose work deserves a proper page.
                  </p>
                </motion.div>
                <div id="hero-fan-target" className="relative h-72 w-full md:h-96 md:w-[calc((100%-4rem)*0.54)] md:shrink-0 xl:w-[calc((100%-5rem)*0.54)]">
                  <div className={`absolute inset-0 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_22px_44px_-18px_rgb(0_0_0/0.3)] ring-1 ring-foreground/5 ${reduced ? "" : "md:hidden"}`}>
                    {reduced && <Image src={illustration} alt="" fill sizes="(min-width: 768px) 32vw, 80vw" className="object-contain p-4" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
