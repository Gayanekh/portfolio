import Link from "next/link";
import { Inter_Tight } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AuthShowcase from "@/components/auth/AuthShowcase";
import BrandMark from "@/components/auth/BrandMark";
import { authPageClassName } from "@/components/auth/auth-page-class";

const interTight = Inter_Tight({ subsets: ["latin"] });

// Shared by /login and /register so the brand mark and showcase stay mounted
// while only the form column content changes between the two routes.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`${interTight.className} ${authPageClassName}`}>
      <div className="grid min-[861px]:min-h-[calc(100dvh_-_32px)] min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] min-[1101px]:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        <div className="flex min-w-0 flex-col px-4 pb-8 pt-4 min-[861px]:px-[clamp(16px,4vw,56px)] min-[861px]:pb-4 min-[861px]:pt-5">
          <header className="flex min-h-11 items-center justify-between gap-3">
            <Link href="/" aria-label="Portory home" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
              <BrandMark />
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "gap-1.5 rounded-full border-transparent bg-transparent px-3.5 text-sm font-semibold text-foreground shadow-none hover:bg-card hover:text-foreground focus-visible:ring-foreground min-[861px]:hidden")}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to home
            </Link>
          </header>
          {children}
        </div>
        <AuthShowcase />
      </div>
    </main>
  );
}
