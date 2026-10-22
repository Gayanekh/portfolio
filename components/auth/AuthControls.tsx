"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, LogOut } from "lucide-react";
import { useAccount, type Account } from "@/components/auth/useAccount";

const smooth = [0.22, 1, 0.36, 1] as const;

// "Get started": dark, square, its arrow nudging on hover.
const startButton =
  "group inline-flex h-10 items-center gap-1.5 rounded bg-foreground pl-4 pr-3.5 text-sm font-medium text-white transition-colors hover:bg-foreground/85";
const startArrow = <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />;

// The account's photo, or its initials on a dark disc.
function Avatar({ account, size }: { account: Account; size: "sm" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-foreground font-semibold text-white ring-2 ring-white ${
        size === "sm" ? "size-7 text-[10px]" : "size-11 text-sm"
      }`}
    >
      {account.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- the account's avatar from storage
        <img src={account.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        account.initials
      )}
    </span>
  );
}

// Signed out: Log in and Get started. Signed in: the account (its avatar and
// first name, opening a menu with who is signed in and Log out on hover,
// click or Arrow Down) and Get started. `start={false}` leaves Get started out
// (where another button already leads to the templates); `avatarOnly` shows
// the account as its avatar alone (in tight spots, like the compact nav bar).
export default function AuthControls({ start = true, avatarOnly = false }: { start?: boolean; avatarOnly?: boolean }) {
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { account, signOut: endSession } = useAccount();

  if (account) {
    const { fullName, email } = account;
    const firstName = fullName.split(" ")[0] || fullName;

    const signOut = async () => {
      setLeaving(true);
      if (await endSession()) setIsMenuOpen(false);
      setLeaving(false);
    };

    return (
      <div className="flex items-center gap-2">
        <div
          className="relative"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsMenuOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsMenuOpen(false);
              accountTriggerRef.current?.focus();
            } else if (event.key === "ArrowDown" && event.target === accountTriggerRef.current) {
              event.preventDefault();
              setIsMenuOpen(true);
            }
          }}
        >
          <button
            ref={accountTriggerRef}
            type="button"
            aria-label={`Account menu for ${fullName}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex h-10 cursor-pointer items-center gap-2 rounded outline-none ${avatarOnly ? "px-1.5" : "pl-1.5 pr-2.5"} transition-colors focus-visible:ring-2 focus-visible:ring-foreground/20 ${
              isMenuOpen ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.05]"
            }`}
          >
            <Avatar account={account} size="sm" />
            {!avatarOnly && (
              <>
                <span className="max-w-[8rem] truncate text-sm font-medium text-foreground">{firstName}</span>
                <ChevronDown aria-hidden="true" className={`size-4 text-foreground/45 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: smooth }}
                className="absolute right-0 top-full z-50 w-72 origin-top-right pt-2"
              >
                <div role="menu" aria-label="Account menu" className="overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_16px_40px_-12px_rgb(0_0_0/0.25)]">
                  {/* Who is signed in */}
                  <div className="flex items-center gap-3 rounded-lg bg-foreground/[0.03] p-3">
                    <Avatar account={account} size="lg" />
                    <div className="min-w-0 leading-tight">
                      <p className="m-0 truncate text-sm font-semibold text-foreground">{fullName}</p>
                      {email && <p className="m-0 mt-1 truncate text-xs text-foreground/50">{email}</p>}
                    </div>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    disabled={leaving}
                    className="mt-1.5 flex w-full cursor-pointer items-center gap-2.5 rounded px-3 py-2.5 text-left text-sm font-medium text-foreground/75 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:cursor-default disabled:opacity-50"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    {leaving ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {start && (
          <Link href="/templates" className={startButton}>
            Get started
            {startArrow}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/login"
        className="inline-flex h-10 items-center rounded px-3.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
      >
        Log in
      </Link>
      {start && (
        <Link href="/templates" className={startButton}>
          Get started
          {startArrow}
        </Link>
      )}
    </div>
  );
}
