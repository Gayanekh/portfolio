"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MoveRight } from "lucide-react";
import { useAccount, type Account } from "@/components/auth/useAccount";

const smooth = [0.22, 1, 0.36, 1] as const;
// The account menu's width, in px.
const MENU_WIDTH = 256;
// A row of the account menu, fading in a little after the one before.
const menuItem = { hidden: { opacity: 0, y: -4 }, shown: { opacity: 1, y: 0, transition: { duration: 0.25, ease: smooth } } };

// "Log in": outlined, filling dark on hover. "Get started": dark, square, its
// arrow nudging on hover.
const startButton =
  "group inline-flex h-10 items-center gap-1.5 rounded bg-foreground pl-4 pr-3.5 text-sm font-medium text-white transition-colors hover:bg-foreground/85";
const startArrow = <MoveRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />;

// The account's photo, or its initials on a disc in the brand colour.
function Avatar({ account, size }: { account: Account; size: "sm" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-semibold text-white ${
        size === "sm" ? "size-9 text-xs" : "size-11 text-sm"
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
// first name, opening a menu with who is signed in, Profile (soon) and Log
// out on hover, click or Arrow Down) and Get started. `start={false}` leaves Get started out
// (where another button already leads to the templates); `avatarOnly` shows
// the account as its avatar alone (in tight spots, like the compact nav bar).
export default function AuthControls({ start = true, avatarOnly = false }: { start?: boolean; avatarOnly?: boolean }) {
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // The menu is drawn on the page body (headers clip what spills out of
  // them), under the avatar: where, measured as it opens. Scrolling or
  // resizing closes it, so it never drifts from the avatar.
  const [spot, setSpot] = useState<{ top: number; left: number } | null>(null);
  const openMenu = () => {
    const box = accountTriggerRef.current?.getBoundingClientRect();
    // Centred under the avatar, kept on screen.
    if (box) setSpot({ top: box.bottom, left: Math.min(Math.max(8, box.left + box.width / 2 - MENU_WIDTH / 2), window.innerWidth - MENU_WIDTH - 8) });
    setIsMenuOpen(true);
  };
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    // The page scrolling, not any element on it (sliders scroll on their own).
    window.addEventListener("scroll", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [isMenuOpen]);
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
          onMouseEnter={() => openMenu()}
          onMouseLeave={() => setIsMenuOpen(false)}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null;
            if (!event.currentTarget.contains(next) && !menuRef.current?.contains(next)) {
              setIsMenuOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsMenuOpen(false);
              accountTriggerRef.current?.focus();
            } else if (event.key === "ArrowDown" && event.target === accountTriggerRef.current) {
              event.preventDefault();
              openMenu();
            }
          }}
        >
          <button
            ref={accountTriggerRef}
            type="button"
            aria-label={`Account menu for ${fullName}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => (isMenuOpen ? setIsMenuOpen(false) : openMenu())}
            className={`flex h-10 cursor-pointer items-center gap-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-foreground/20 ${
              avatarOnly ? "w-10 justify-center rounded-full" : `rounded pl-1.5 pr-2.5 ${isMenuOpen ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.05]"}`
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

          {/* The menu drops in, its rows following one after another; on the
              page body, so the header does not clip it */}
          {typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {isMenuOpen && spot && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.28, ease: smooth }}
                    ref={menuRef}
                    style={{ top: spot.top, left: spot.left, width: MENU_WIDTH }}
                    className="fixed z-[1100] origin-top pt-2"
                  >
                    <motion.div
                      role="menu"
                      aria-label="Account menu"
                      initial="hidden"
                      animate="shown"
                      variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } }}
                      className="overflow-hidden rounded-lg bg-white py-2 shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_18px_44px_-14px_rgb(0_0_0/0.28)]"
                    >
                      {/* Who is signed in */}
                      <motion.div variants={menuItem} className="px-5 pb-3 pt-2.5">
                        <p className="m-0 truncate text-[15px] font-semibold text-foreground">{fullName}</p>
                        {email && <p className="m-0 mt-1 truncate text-[13px] text-foreground/55">{email}</p>}
                      </motion.div>
    
                      {/* Profile: no page for it yet */}
                      <motion.span
                        variants={menuItem}
                        role="menuitem"
                        aria-disabled="true"
                        className="flex w-full cursor-default items-center justify-between px-5 py-2.5 text-[15px] text-foreground/45"
                      >
                        Profile
                        <span className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50">Soon</span>
                      </motion.span>
    
                      <motion.button
                        variants={menuItem}
                        type="button"
                        role="menuitem"
                        onClick={signOut}
                        disabled={leaving}
                        className="flex w-full cursor-pointer items-center px-5 py-2.5 text-left text-[15px] text-foreground transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:outline-none disabled:cursor-default disabled:opacity-50"
                      >
                        {leaving ? "Logging out..." : "Log out"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body,
            )}
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
        className="inline-flex h-10 items-center rounded border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white"
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
