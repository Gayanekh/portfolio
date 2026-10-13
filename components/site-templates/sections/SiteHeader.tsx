"use client";

import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Menu, Section } from "../core/blocks";
import { useField } from "../core/context";

const header = cva("grid items-center", {
  variants: {
    layout: {
      // The site title over the menu in the middle, slots on either side. On
      // phones the slots share the first row; the title and menu go under.
      centered: "grid-cols-2 gap-y-3.5 @xl:grid-cols-[1fr_auto_1fr]",
      // The site title on the left, the menu on the right.
      split: "grid-cols-1 justify-items-center gap-y-3 @xl:grid-cols-[auto_1fr] @xl:justify-items-stretch",
    },
  },
  defaultVariants: { layout: "centered" },
});

const title = cva("font-display leading-none", {
  variants: {
    layout: {
      centered: "text-center text-[length:clamp(2rem,4cqw,3.125rem)] font-black tracking-[-0.02em]",
      split: "text-lg font-medium tracking-[-0.03em]",
    },
  },
  defaultVariants: { layout: "centered" },
});

// The header templates share. Its section's field: `siteTitle`.
export default function SiteHeader({ start, end, layout }: { start?: ReactNode; end?: ReactNode } & VariantProps<typeof header>) {
  const siteTitle = <div className={title({ layout })}>{useField("siteTitle").node}</div>;

  if (layout === "split") {
    return (
      <Section as="header" spacing="xs">
        <div className={header({ layout })}>
          {siteTitle}
          <div className="flex items-center justify-end gap-6">
            <Menu />
            {end}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section as="header" spacing="sm">
      <div className={header({ layout })}>
        <div className="flex items-center gap-3.5">{start}</div>
        <div className="order-3 col-span-full flex flex-col gap-3.5 @xl:order-none @xl:col-span-1 @xl:gap-[18px]">
          {siteTitle}
          <Menu />
        </div>
        <div className="flex items-center gap-3.5 justify-self-end text-[11px] uppercase tracking-[0.1em]">{end}</div>
      </div>
    </Section>
  );
}

export const siteHeaderDefaults = { siteTitle: "Your Site Title" };
