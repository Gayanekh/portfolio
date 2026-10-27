"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { useLastPage } from "@/components/navigation/LastPage";

// The sign-in pages' Back link: back to the page the visitor was on before
// signing in, or home when they opened the page directly. A quiet link (no
// box), its arrow nudging left on hover, so the header stays light.
export default function AuthBack() {
  return (
    <Link
      href={useLastPage() ?? "/"}
      className="group inline-flex h-10 items-center gap-2 rounded px-1 text-[0.8125rem] font-medium text-foreground/70 no-underline transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <MoveLeft aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
      Back
    </Link>
  );
}
