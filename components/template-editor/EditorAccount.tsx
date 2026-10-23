"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, LogIn, LogOut } from "lucide-react";
import { useAccount, type Account } from "@/components/auth/useAccount";
import Tooltip from "@/components/ui/tooltip";

const smooth = [0.22, 1, 0.36, 1] as const;

function Avatar({ account, size }: { account: Account; size: "sm" | "md" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-foreground/[0.08] font-semibold text-foreground/70 ring-1 ring-foreground/10 ${
        size === "sm" ? "size-8 text-[11px]" : "size-9 text-xs"
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

// The account in the editor's sidebar: who is signed in, opening a small menu
// (upwards) with Log out. With unsaved changes the menu says they will be
// lost. Signed out, a Sign in link that comes back to this editor. `compact`
// is the sidebar's rail: the avatar alone, which opens the sidebar (`onExpand`),
// where the menu is (the rail is too narrow, and clips, for a menu).
export default function EditorAccount({ compact = false, unsaved, signInHref, onExpand }: { compact?: boolean; unsaved: boolean; signInHref: string; onExpand?: () => void }) {
  const { account, loading, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // A press anywhere else, or Esc, closes the menu.
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  if (loading) return <span aria-hidden="true" className={compact ? "size-8" : "h-12"} />;

  // Signed out, Sign in is an outlined button that fills dark on hover (like
  // the site header's Log in), so it is easy to find without competing with
  // Edit: with a line on why in the sidebar, a square on the rail.
  if (!account) {
    const signIn = "inline-flex shrink-0 items-center justify-center gap-2 rounded border border-foreground/20 text-sm font-medium text-foreground no-underline transition-colors hover:border-foreground hover:bg-foreground hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
    if (compact) {
      return (
        <Tooltip label="Sign in" side="right">
          <Link href={signInHref} aria-label="Sign in" className={`${signIn} size-10`}>
            <LogIn aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Tooltip>
      );
    }
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-[13px] leading-snug text-foreground/60">Sign in to save your work</span>
        <Link href={signInHref} className={`${signIn} group h-10 px-4`}>
          <LogIn aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          Sign in
        </Link>
      </div>
    );
  }

  const logOut = async () => {
    setLeaving(true);
    if (!(await signOut())) setLeaving(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <Tooltip label={account.fullName} side="right" disabled={!compact}>
        <button
          type="button"
          aria-haspopup={compact ? undefined : "menu"}
          aria-expanded={compact ? undefined : open}
          aria-label={`Account: ${account.fullName}`}
          onClick={() => (compact && onExpand ? onExpand() : setOpen((value) => !value))}
          className={`flex cursor-pointer items-center gap-3 rounded text-left transition-colors hover:bg-foreground/[0.05] ${
            compact ? "size-10 justify-center" : "w-full px-2 py-2"
          } ${open ? "bg-foreground/[0.05]" : ""}`}
        >
          <Avatar account={account} size="sm" />
          {!compact && (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm font-semibold text-foreground">{account.fullName}</span>
                {account.email && <span className="truncate text-xs text-foreground/50">{account.email}</span>}
              </span>
              <ChevronUp className={`h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-300 ${open ? "" : "rotate-180"}`} />
            </>
          )}
        </button>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: smooth }}
            className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl bg-white p-2 shadow-[0_12px_36px_-8px_rgb(0_0_0/0.25),0_1px_3px_rgb(0_0_0/0.06)] ring-1 ring-black/5"
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar account={account} size="md" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-semibold text-neutral-950">{account.fullName}</span>
                {account.email && <span className="truncate text-xs text-neutral-500">{account.email}</span>}
              </span>
            </div>
            {unsaved && <p className="mx-2 mb-1 mt-1 rounded-lg bg-amber-50 px-2.5 py-2 text-xs leading-snug text-amber-800">You have unsaved changes. Save them first, or they will be lost when you log out.</p>}
            <div className="my-1 h-px bg-neutral-100" />
            <button
              type="button"
              role="menuitem"
              onClick={logOut}
              disabled={leaving}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded px-2.5 py-2.5 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-default disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {leaving ? "Logging out..." : "Log out"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
