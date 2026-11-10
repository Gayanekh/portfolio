"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Eye, EyeOff, ImageUp, KeyRound, LayoutTemplate, type LucideIcon, LogOut, Mail, ShieldCheck, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { announceProfileChange } from "@/components/auth/useAccount";
import { MIN_PASSWORD_LENGTH } from "@/components/auth/LoginExperience";
import Header from "@/components/template-landing/Header";
import Label from "@/components/template-landing/Label";
import { focusRing, fonts, frame, serif, themes } from "@/components/template-landing/ui";
import { fluidText } from "@/components/landing/landing-ui";
import Modal from "@/components/ui/modal";
import { avatarColor, getInitials, GOOGLE_BLUE } from "@/lib/auth-routing";
import { ACCEPTED_IMAGE_TYPES, uploadPortfolioImage, validatePortfolioImage } from "@/lib/portfolio-images";
import { createClient } from "@/lib/supabase/client";
import { loadPortfolio, type SavedPortfolio } from "@/lib/portfolio-client";
import { getSiteTemplate, siteTemplateContinueHref } from "@/components/site-templates/registry";

const IMAGES_BUCKET = "portfolio-images";
const ease = [0.22, 1, 0.36, 1] as const;

// Controls, in the landing page's style (its ink, card grey and hairlines, read from the page's
// --fg, --bg, --card, --dim and --line): 4px corners; light (the card grey) by default, the ink for the
// main one and for saving a form, red only for deleting the account. Fields focus quietly: the ink
// border and a faint halo.
const field = "h-11 w-full rounded-[4px] border border-solid border-[color-mix(in_srgb,var(--fg)_20%,transparent)] bg-[var(--bg)] px-3.5 text-[0.9375rem] tracking-[-0.01em] text-[var(--fg)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--dim)] hover:border-[color-mix(in_srgb,var(--fg)_45%,transparent)] focus:border-[var(--fg)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--fg)_10%,transparent)]";
const label = "mb-1.5 block text-[0.8125rem] text-[var(--dim)]";
const button = `${focusRing} inline-flex cursor-pointer items-center justify-center gap-2 rounded-[4px] border-0 font-medium tracking-[-0.01em] transition-colors duration-300 disabled:cursor-default disabled:opacity-40`;
const light = "bg-[var(--card)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]";
const ink = "bg-[var(--fg)] text-[var(--bg)] hover:bg-[color-mix(in_srgb,var(--fg)_82%,var(--bg))]";
const outline = `${button} ${light} h-11 px-5 text-[0.9375rem]`;
const brandOutline = `${button} ${ink} h-11 px-5 text-[0.9375rem]`;
const solid = `${button} ${ink} h-11 px-5 text-[0.9375rem] disabled:opacity-30`;
const quiet = `${button} h-11 px-4 text-[0.9375rem] text-[var(--dim)] hover:bg-[var(--card)] hover:text-[var(--fg)]`;
const small = `${button} ${light} h-9 px-3.5 text-[0.8125rem]`;
const smallDanger = `${button} h-9 border border-solid border-red-300 bg-transparent px-3.5 text-[0.8125rem] text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white`;
const danger = `${button} h-11 bg-red-600 px-5 text-[0.9375rem] text-white hover:bg-red-700 disabled:hover:bg-red-600`;
// How the page comes in: each block rises 16px out of nothing, the rows one after another. It is CSS
// (not a script), so the page is on screen, with its data, as it is sent, and moves from there; the
// rows' delays are listed in full because Tailwind needs whole class names.
const enter = "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both [animation-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none";
const after = ["[animation-delay:0ms]", "[animation-delay:120ms]", "[animation-delay:200ms]", "[animation-delay:270ms]", "[animation-delay:340ms]", "[animation-delay:410ms]", "[animation-delay:480ms]", "[animation-delay:550ms]", "[animation-delay:620ms]"];

// A value that changes (a new name, a new photo) swaps in softly: the old one lifts away, blurring, and
// the new one settles. `id` is what identifies the value; it plays when it changes, not on the first show.
function Swap({ id, block = false, children }: { id: string; block?: boolean; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.35, ease }}
        className={block ? "block" : "inline-block"}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

const spinner = <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;

type Editing = "name" | "password" | null;

// Is this photo one of ours (in the user's folder of the images bucket)? Only
// those are deleted when replaced; a Google photo is just forgotten.
const ownFile = (url: string | null, userId: string) => {
  const marker = `/${IMAGES_BUCKET}/${userId}/`;
  const at = url?.indexOf(marker) ?? -1;
  return url && at >= 0 ? `${userId}/${decodeURIComponent(url.slice(at + marker.length).split("?")[0])}` : null;
};

function ErrorText({ text }: { text: string }) {
  return text ? (
    <p role="alert" className="m-0 text-[0.8125rem] text-destructive">
      {text}
    </p>
  ) : null;
}

// The account's saved page (an account holds one): its name and template,
// whether it is live, and Continue editing, the way back to it in the editor
// ("Use this template" always starts a fresh copy). Nothing shows until it
// has loaded; with no page yet, a link to the templates.
function YourPage() {
  const [portfolio, setPortfolio] = useState<SavedPortfolio | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    loadPortfolio()
      .then((result) => live && setPortfolio(result))
      .catch(() => live && setPortfolio(null));
    return () => {
      live = false;
    };
  }, []);
  if (portfolio === undefined)
    return (
      <Section title="Your page" text="The page you saved, to keep editing or share." step={2}>
        <div aria-hidden="true" className="flex animate-pulse items-center gap-5 py-6">
          <span className="size-5 rounded-[4px] bg-[var(--card)]" />
          <div className="grid flex-1 gap-2.5">
            <span className="h-4 w-40 max-w-full rounded-[4px] bg-[var(--card)]" />
            <span className="h-3.5 w-72 max-w-full rounded-[4px] bg-[var(--card)]" />
          </div>
        </div>
      </Section>
    );
  const template = portfolio ? getSiteTemplate(portfolio.template_id) : undefined;
  const data = portfolio?.portfolio_data as { name?: unknown } | null | undefined;
  // Minimal and Bold, the earlier templates, open their saved page in their own builder.
  const templateName = template?.name ?? (portfolio ? portfolio.template_id.charAt(0).toUpperCase() + portfolio.template_id.slice(1) : "");
  const continueHref = portfolio ? (template ? siteTemplateContinueHref(template.id) : `/templates/editor/${portfolio.template_id}`) : "/templates";
  const name = typeof data?.name === "string" && data.name ? data.name : templateName;
  return (
    <Section title="Your page" text="The page you saved, to keep editing or share." step={2}>
      {portfolio ? (
        <Item
          Icon={LayoutTemplate}
          step={3}
          title={name ?? "Your page"}
          value={
            <>
              {templateName} template · {portfolio.status === "published" ? "Published" : "Draft"}
              {portfolio.status === "published" && (
                <>
                  {" · "}
                  <a href={`/p/${portfolio.slug}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                    View live page
                  </a>
                </>
              )}
            </>
          }
          action={
            <Link href={continueHref} className={small}>
              Continue editing
            </Link>
          }
        />
      ) : (
        <Item
          Icon={LayoutTemplate}
          step={3}
          title="No page yet"
          value="Choose a template, make it yours and save it to see it here."
          action={
            <Link href="/templates" className={small}>
              Browse templates
            </Link>
          }
        />
      )}
    </Section>
  );
}

// A group of settings, laid out as the landing page's sections are: on the left, in the
// landing's label (a small square and the name in mono capitals) with a short line under it; on the
// right, its rows as one list with hairlines between them. The title is also a heading for screen readers.
function Section({ title, text, step = 0, children }: { title: string; text: string; step?: number; children: ReactNode }) {
  return (
    <section className="grid gap-8 border-0 border-t border-solid border-[var(--line)] pt-10 lg:grid-cols-4 lg:gap-0">
      <div className={`flex flex-col gap-6 lg:pr-[clamp(1rem,2vw,2.5rem)] ${enter} ${after[step]}`}>
        <h2 className="sr-only">{title}</h2>
        <div aria-hidden="true">
          <Label>{title}</Label>
        </div>
        <p className="m-0 max-w-[21rem] text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">{text}</p>
      </div>
      <div className="divide-y divide-solid divide-[var(--line)] border-0 border-b border-solid border-[var(--line)] lg:col-span-3">{children}</div>
    </section>
  );
}

// One setting as a full-width row: its icon on a small soft tile, its title
// and value, and its action on the right. Open (`open` with a form in
// `children`), its form slides open beneath, under the title.
function Item({
  Icon,
  title,
  value,
  action,
  open = false,
  tone = "default",
  step = 0,
  children,
}: {
  Icon: LucideIcon;
  title: string;
  value?: ReactNode;
  action?: ReactNode;
  open?: boolean;
  tone?: "default" | "danger";
  // Which step of the entrance it comes in at (see `after`).
  step?: number;
  children?: ReactNode;
}) {
  const red = tone === "danger";
  return (
    <div className={`py-6 ${enter} ${after[step]}`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <span aria-hidden="true" className="grid place-items-center">
          <Icon className={`size-5 ${red ? "text-red-500" : "text-[var(--dim)]"}`} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <h3 className={`m-0 text-[1.0625rem] font-medium tracking-[-0.02em] ${red ? "text-red-600" : "text-[var(--fg)]"}`}>{title}</h3>
          {value && <div className="mt-1 break-words text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">{value}</div>}
        </div>
        {action && <div className="col-start-2 sm:col-start-auto sm:justify-self-end">{action}</div>}
      </div>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
            {/* Under the title; room around it so its fields' focus halo is never clipped */}
            <div className="-mx-1 max-w-2xl px-1 pb-1 pt-5 sm:pl-[calc(1.25rem+1.25rem+0.25rem)]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The account page, after a classic personal profile: your photo in a large
// ringed circle beside your name, with your email, since when and photo
// buttons; then the account settings as a list of rows (name, email,
// password, sign-in methods, sessions, delete), whose forms open in place.
// Saves are confirmed by a toast; deleting by a dialog.
export default function AccountPage(props: {
  userId: string;
  email: string;
  memberSince: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  hasPassword: boolean;
  withGoogle: boolean;
}) {
  const { userId, email } = props;
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [editing, setEditing] = useState<Editing>(null);

  /* ---------- Toast ---------- */

  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const say = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* ---------- Photo (saved at once) ---------- */

  const [photo, setPhoto] = useState(props.avatarUrl);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const choosePhoto = () => fileRef.current?.click();

  async function setPhotoTo(url: string | null) {
    const previous = photo;
    const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
    if (error) throw new Error("Your photo could not be saved. Try again.");
    setPhoto(url);
    announceProfileChange();
    const oldFile = ownFile(previous, userId);
    if (oldFile && previous !== url) await supabase.storage.from(IMAGES_BUCKET).remove([oldFile]);
  }

  async function pickPhoto(file: File | undefined) {
    if (!file) return;
    setPhotoError("");
    const invalid = validatePortfolioImage(file);
    if (invalid) return setPhotoError(invalid);
    setPhotoBusy(true);
    try {
      await setPhotoTo(await uploadPortfolioImage(file));
      say("Photo updated");
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Your photo could not be uploaded.");
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removePhoto() {
    setPhotoError("");
    setPhotoBusy(true);
    try {
      await setPhotoTo(null);
      say("Photo removed");
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Your photo could not be removed.");
    } finally {
      setPhotoBusy(false);
    }
  }

  /* ---------- Name ---------- */

  const [saved, setSaved] = useState({ first: props.firstName, last: props.lastName });
  const [first, setFirst] = useState(props.firstName);
  const [last, setLast] = useState(props.lastName);
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameChanged = first.trim() !== saved.first.trim() || last.trim() !== saved.last.trim();
  const fullName = [saved.first, saved.last].filter(Boolean).join(" ");
  const initials = getInitials(saved.first || email, saved.last || " ").trim() || email.slice(0, 2).toUpperCase();
  const since = new Date(props.memberSince).toLocaleDateString("en", { month: "long", year: "numeric" });

  const closeName = () => {
    setFirst(saved.first);
    setLast(saved.last);
    setNameError("");
    setEditing(null);
  };

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nameChanged) return;
    setNameError("");
    const name = { first: first.trim(), last: last.trim() };
    if (!name.first) return setNameError("Your first name can't be empty.");
    setSavingName(true);
    const { error } = await supabase.from("profiles").update({ first_name: name.first.slice(0, 100), last_name: name.last.slice(0, 100) }).eq("id", userId);
    setSavingName(false);
    if (error) return setNameError("Your name could not be saved. Try again.");
    setSaved(name);
    setFirst(name.first);
    setLast(name.last);
    setEditing(null);
    announceProfileChange();
    say("Name saved");
  }

  /* ---------- Password ---------- */

  const [hasPassword, setHasPassword] = useState(props.hasPassword);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const passwordReady = (!hasPassword || current.length > 0) && password.length > 0 && repeat.length > 0;

  const closePassword = () => {
    setCurrent("");
    setPassword("");
    setRepeat("");
    setPasswordError("");
    setEditing(null);
  };

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordReady) return;
    setPasswordError("");
    if (password.length < MIN_PASSWORD_LENGTH) return setPasswordError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (password !== repeat) return setPasswordError("The two new passwords don't match.");
    setSavingPassword(true);
    // With a password already, it is checked first (signing in with it).
    if (hasPassword) {
      const { error: checkError } = await supabase.auth.signInWithPassword({ email, password: current });
      if (checkError) {
        setSavingPassword(false);
        return setPasswordError("Your current password is not right.");
      }
    }
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      return setPasswordError(
        error.code === "same_password"
          ? "Choose a new password different from your current one."
          : error.code === "weak_password"
            ? "That password is too easy to guess. Try a longer one."
            : error.code === "reauthentication_needed"
              ? "For your security, log out and in again, then change your password."
              : "Your password could not be changed. Try again.",
      );
    }
    const wasSet = hasPassword;
    closePassword();
    setHasPassword(true);
    say(wasSet ? "Password updated" : "Password set");
  }

  /* ---------- Sessions ---------- */

  const [signingOut, setSigningOut] = useState(false);
  const [sessionError, setSessionError] = useState("");

  async function signOutEverywhere() {
    setSessionError("");
    setSigningOut(true);
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      setSigningOut(false);
      return setSessionError("Could not sign out everywhere. Try again.");
    }
    router.replace("/login");
    router.refresh();
  }

  /* ---------- Delete account (confirmed in a dialog) ---------- */

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const confirmed = confirmText.trim() === "DELETE";

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed || deleting) return;
    setDeleteError("");
    setDeleting(true);
    // The user's images first (SQL cannot delete stored files), then the
    // account, which takes the profile and portfolio with it.
    const bucket = supabase.storage.from(IMAGES_BUCKET);
    for (let round = 0; round < 50; round += 1) {
      const { data: files, error: listError } = await bucket.list(userId, { limit: 100 });
      if (listError || !files?.length) break;
      const { error: removeError } = await bucket.remove(files.map((file) => `${userId}/${file.name}`));
      if (removeError) break;
    }
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      setDeleting(false);
      return setDeleteError("Your account could not be deleted. Try again, or log out and in again first.");
    }
    await supabase.auth.signOut({ scope: "local" });
    window.location.assign("/");
  }

  const closeConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setConfirmText("");
    setDeleteError("");
  };

  return (
    <div className={`${fonts} ${themes.light} relative min-h-screen bg-[var(--bg)] text-[var(--fg)]`}>
      {/* The landing page's header (the user asked), without its section links, and the page in its type and colours. */}
      <Header sections={false} />

      <main data-site-scale className={`${frame} pb-28 pt-[clamp(7rem,calc(4.456rem_+_9.467vw),9rem)]`}>
        <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} hidden onChange={(event) => pickPhoto(event.target.files?.[0])} />

        {/* The profile, as a landing section: its label on the left; on the right the photo in a plain circle
            beside the name (the landing's title type), your email, since when, and the photo buttons. */}
        <header className={`grid gap-10 lg:grid-cols-4 lg:gap-0 ${enter} ${after[0]}`}>
          <div className="lg:pr-[clamp(1rem,2vw,2.5rem)]">
            <Label>Your account</Label>
          </div>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-[clamp(2rem,4vw,3.5rem)] lg:col-span-3">
            <button
              type="button"
              onClick={choosePhoto}
              disabled={photoBusy}
              aria-label={photo ? "Change your photo" : "Add a photo"}
              className={`${focusRing} group relative grid size-[clamp(7.5rem,calc(5.5rem_+_6vw),10rem)] shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full text-white ${props.withGoogle && !photo ? GOOGLE_BLUE : avatarColor(fullName || email.split("@")[0])}`}
            >
              <AnimatePresence initial={false}>
                <motion.span key={photo ?? "initials"} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="absolute inset-0 grid place-items-center">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- the user's photo from storage or Google
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="text-5xl font-light tracking-[-0.04em]">
                      {initials}
                    </span>
                  )}
                </motion.span>
              </AnimatePresence>
              <span aria-hidden="true" className={`absolute inset-0 grid place-items-center bg-black/40 text-white transition-opacity ${photoBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                {photoBusy ? <span className="size-7 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="size-7" strokeWidth={1.5} />}
              </span>
            </button>

            <div className="min-w-0">
              <h1 className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
                <Swap id={fullName || "welcome"} block>
                {fullName ? (
                  <>
                    {fullName.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className={`${serif} tracking-[-0.03em]`}>{fullName.split(" ").slice(-1)[0]}</span>
                  </>
                ) : (
                  "Welcome"
                )}
              </Swap>
              </h1>
              <p className="m-0 mt-4 max-w-md text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">
                {email}
                <br />
                Member of Portory since {since}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={choosePhoto} disabled={photoBusy} className={brandOutline}>
                  {photoBusy ? spinner : <ImageUp aria-hidden="true" className="size-4" />}
                  {photo ? "Change photo" : "Add a photo"}
                </button>
                {photo && (
                  <button type="button" onClick={removePhoto} disabled={photoBusy} className={outline}>
                    Remove
                  </button>
                )}
              </div>
              {photoError && (
                <div className="mt-3">
                  <ErrorText text={photoError} />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mt-[clamp(4rem,7vw,6rem)]">
          <YourPage />
        </div>

        <div className="mt-[clamp(4rem,7vw,6rem)]">
          <Section title="Account settings" text="Your name, how you sign in, and your account, all in one place." step={4}>
            <Item
              Icon={UserRound}
              step={5}
              title="Name"
              value={<Swap id={fullName || "none"}>{fullName || "Not set"}</Swap>}
              open={editing === "name"}
              action={
                editing !== "name" && (
                  <button type="button" onClick={() => setEditing("name")} className={small}>
                    Edit name
                  </button>
                )
              }
            >
              <form onSubmit={saveName} className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className={label}>
                      First name
                    </label>
                    <input id="first-name" autoFocus required maxLength={100} autoComplete="given-name" value={first} onChange={(event) => setFirst(event.target.value)} className={field} />
                  </div>
                  <div>
                    <label htmlFor="last-name" className={label}>
                      Last name
                    </label>
                    <input id="last-name" maxLength={100} autoComplete="family-name" value={last} onChange={(event) => setLast(event.target.value)} className={field} />
                  </div>
                </div>
                <ErrorText text={nameError} />
                <div className="flex gap-2">
                  <button type="submit" disabled={!nameChanged || savingName} className={solid}>
                    {savingName && spinner}
                    {savingName ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={closeName} className={quiet}>
                    Cancel
                  </button>
                </div>
              </form>
            </Item>
            <Item Icon={Mail} step={6} title="Email" value={email} action={<span className="inline-flex h-9 items-center rounded border border-dashed border-[var(--line)] px-3.5 text-[0.8125rem] text-[var(--dim)]">Changing email · coming soon</span>} />
            <Item
              Icon={KeyRound}
              step={7}
              title="Password"
              value={hasPassword ? "Set. Change it any time." : "Not set yet. You log in with Google."}
              open={editing === "password"}
              action={
                editing !== "password" && (
                  <button type="button" onClick={() => setEditing("password")} className={small}>
                    {hasPassword ? "Change password" : "Set a password"}
                  </button>
                )
              }
            >
              <form onSubmit={changePassword} className="grid gap-3">
                {hasPassword && (
                  <div>
                    <label htmlFor="current-password" className={label}>
                      Current password
                    </label>
                    <input id="current-password" autoFocus type={showPasswords ? "text" : "password"} autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} className={field} />
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="new-password" className={label}>
                      New password
                    </label>
                    <input id="new-password" autoFocus={!hasPassword} type={showPasswords ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={field} />
                  </div>
                  <div>
                    <label htmlFor="repeat-password" className={label}>
                      Repeat new password
                    </label>
                    <input id="repeat-password" type={showPasswords ? "text" : "password"} autoComplete="new-password" value={repeat} onChange={(event) => setRepeat(event.target.value)} className={field} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="m-0 text-[0.8125rem] text-[var(--dim)]">{MIN_PASSWORD_LENGTH} or more letters, numbers and symbols.</p>
                  <button type="button" aria-pressed={showPasswords} onClick={() => setShowPasswords((value) => !value)} className={`${focusRing} inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] text-[0.8125rem] text-[var(--dim)] transition-colors hover:text-[var(--fg)]`}>
                    {showPasswords ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                    {showPasswords ? "Hide" : "Show"}
                  </button>
                </div>
                <ErrorText text={passwordError} />
                <div className="flex gap-2">
                  <button type="submit" disabled={!passwordReady || savingPassword} className={solid}>
                    {savingPassword && spinner}
                    {savingPassword ? "Saving..." : hasPassword ? "Update password" : "Set password"}
                  </button>
                  <button type="button" onClick={closePassword} className={quiet}>
                    Cancel
                  </button>
                </div>
              </form>
            </Item>
            <Item
              Icon={ShieldCheck}
              step={8}
              title="Sign-in methods"
              value={hasPassword ? "You log in with your email and password." : "You log in with your Google account."}
              action={
                <span className="flex flex-wrap gap-1.5">
                  {hasPassword && <span className="rounded-[4px] border border-solid border-[var(--line)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--dim)]">Email</span>}
                  {props.withGoogle && <span className="rounded-[4px] border border-solid border-[var(--line)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--dim)]">Google</span>}
                </span>
              }
            />
            <Item
              Icon={LogOut}
              step={8}
              title="Sessions"
              value="Signed in on a shared or lost device? Sign out of Portory everywhere, this device included."
              action={
                <>
                  <button type="button" onClick={signOutEverywhere} disabled={signingOut} className={small}>
                    {signingOut && spinner}
                    {signingOut ? "Signing out..." : "Sign out everywhere"}
                  </button>
                  {sessionError && <div className="mt-2"><ErrorText text={sessionError} /></div>}
                </>
              }
            />
            <Item
              Icon={Trash2}
              step={8}
              tone="danger"
              title="Delete account"
              value="Deletes your account, your portfolio and your images for good."
              action={
                <button type="button" onClick={() => setConfirmOpen(true)} className={smallDanger}>
                  Delete my account
                </button>
              }
            />
          </Section>
        </div>
      </main>

      {/* "Saved" and the like, sliding up at the bottom */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[1100] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
              className="flex items-center gap-2 rounded-[4px] bg-[var(--fg)] px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-[var(--bg)] shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)]"
            >
              <Check aria-hidden="true" className="size-4 text-emerald-400" strokeWidth={2.5} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deleting, confirmed by typing DELETE */}
      <Modal open={confirmOpen} onClose={closeConfirm} labelledBy="delete-confirm-title" describedBy="delete-confirm-text" alert>
        <form onSubmit={deleteAccount} className={`${fonts} ${themes.light} text-[var(--fg)]`}>
          <h2 id="delete-confirm-title" className="m-0 pr-8 text-[1.625rem] font-medium leading-tight tracking-[-0.04em]">
            Delete your account?
          </h2>
          <p id="delete-confirm-text" className="m-0 mt-3 text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">
            Your account, your portfolio and your images will be deleted for good. Type <strong className="font-semibold text-[var(--fg)]">DELETE</strong> to confirm.
          </p>
          <label htmlFor="confirm-delete" className="sr-only">
            Type DELETE to confirm
          </label>
          <input id="confirm-delete" autoFocus autoComplete="off" spellCheck={false} placeholder="DELETE" value={confirmText} onChange={(event) => setConfirmText(event.target.value)} className={`${field} mt-5`} />
          {deleteError && (
            <div className="mt-3">
              <ErrorText text={deleteError} />
            </div>
          )}
          <div className="mt-7 flex justify-end gap-2">
            <button type="button" onClick={closeConfirm} disabled={deleting} className={outline}>
              Cancel
            </button>
            <button type="submit" disabled={!confirmed || deleting} className={danger}>
              {deleting && spinner}
              {deleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
