"use client";

import { Body, Section } from "../core/blocks";

// The footer most templates share: one line of small text.
// Its section's field: `text`.
export default function SiteFooter() {
  return (
    <Section as="footer" spacing="xs" divider>
      <Body field="text" size="sm" tone="muted" />
    </Section>
  );
}

export const siteFooterDefaults = { text: "© Your Site Title" };
