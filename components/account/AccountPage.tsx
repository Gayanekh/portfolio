"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Eye, EyeOff, ImageUp, KeyRound, type LucideIcon, LogOut, Mail, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { announceProfileChange } from "@/components/auth/useAccount";
import { MIN_PASSWORD_LENGTH } from "@/components/auth/LoginExperience";
import LandingHeader from "@/components/landing/LandingHeader";
import { focusRing, fluidText } from "@/components/landing/landing-ui";
import Modal from "@/components/ui/modal";
import { getInitials } from "@/lib/auth-routing";
import { ACCEPTED_IMAGE_TYPES, uploadPortfolioImage, validatePortfolioImage } from "@/lib/portfolio-images";
import { createClient } from "@/lib/supabase/client";

const IMAGES_BUCKET = "portfolio-images";
const ease = [0.22, 1, 0.36, 1] as const;

// Controls: 4px corners; outlined by default (the brand colour for the main
// one), dark for saving a form, red only for deleting the account.
// Fields focus quietly: a brand-colour border and a faint halo, no outline.
const field = "h-11 w-full rounded border border-foreground/[0.14] bg-white px-3.5 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground/40 hover:border-foreground/25 focus:border-primary/60 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary),transparent_88%)]";
const label = "mb-1.5 block text-[0.8125rem] text-foreground/55";
const outline = `${focusRing} inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded border border-foreground/15 bg-white px-5 text-sm font-medium text-foreground shadow-[0_2px_6px_-3px_rgb(0_0_0/0.12)] transition-colors hover:border-foreground/40 disabled:cursor-default disabled:opacity-40`;
const brandOutline = `${focusRing} inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded border border-primary/70 bg-white px-5 text-sm font-medium text-foreground shadow-[0_2px_6px_-3px_rgb(0_0_0/0.12)] transition-colors hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-40`;
const solid = `${focusRing} inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-neutral-900`;
const quiet = `${focusRing} inline-flex h-10 cursor-pointer items-center justify-center rounded px-4 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground disabled:opacity-40`;
const small = `${focusRing} inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded border border-foreground/15 bg-white px-3.5 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-40`;
const smallDanger = `${focusRing} inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded border border-red-200 bg-white px-3.5 text-[0.8125rem] font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white`;
const danger = `${focusRing} inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-red-600`;
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

// The settings: a small heading with a short brand-colour rule and a line
// about it, then its rows as one list, hairlines between them.
function Section({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="grid gap-8">
      <div>
        <h2 className="m-0 w-fit text-[1.375rem] font-semibold tracking-[-0.015em]">
          {title}
          <span aria-hidden="true" className="mt-2.5 block h-0.5 w-7 rounded-full bg-primary" />
        </h2>
        <p className="m-0 mt-4 text-[0.9375rem] text-foreground/55">{text}</p>
      </div>
      <div className="divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]">{children}</div>
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
  children,
}: {
  Icon: LucideIcon;
  title: string;
  value?: ReactNode;
  action?: ReactNode;
  open?: boolean;
  tone?: "default" | "danger";
  children?: ReactNode;
}) {
  const red = tone === "danger";
  return (
    <div className="py-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <span aria-hidden="true" className={`grid size-11 place-items-center rounded-xl ${red ? "bg-red-50" : "bg-[#f4f2ef]"}`}>
          <Icon className={`size-5 ${red ? "text-red-500" : "text-primary"}`} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className={`m-0 text-[1rem] font-semibold tracking-[-0.01em] ${red ? "text-red-600" : "text-foreground"}`}>{title}</h3>
          {value && <div className="mt-1 break-words text-sm leading-relaxed text-foreground/60">{value}</div>}
        </div>
        {action && <div className="col-start-2 sm:col-start-auto sm:justify-self-end">{action}</div>}
      </div>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
            {/* Under the title; room around it so its fields' focus halo is never clipped */}
            <div className="-mx-1 max-w-2xl px-1 pb-1 pt-5 sm:pl-[calc(2.75rem+1.25rem+0.25rem)]">{children}</div>
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

  const rise = (delay: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease, delay } });

  return (
    <div className="relative min-h-screen bg-white text-foreground">
      <LandingHeader links={false} />

      <main data-site-scale className="mx-auto w-content-width pb-28 pt-[clamp(8rem,calc(5.456rem_+_9.467vw),10rem)]">
        <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} hidden onChange={(event) => pickPhoto(event.target.files?.[0])} />

        {/* The profile: photo in a ringed circle beside the name */}
        <motion.header {...rise(0)} className="grid items-center gap-[clamp(2.5rem,calc(0.592rem_+_7.101vw),4rem)] md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="mx-auto rounded-full bg-white p-3 shadow-[0_18px_50px_-18px_rgb(0_0_0/0.28)] ring-1 ring-black/[0.04] md:mx-0">
            <button
              type="button"
              onClick={choosePhoto}
              disabled={photoBusy}
              aria-label={photo ? "Change your photo" : "Add a photo"}
              className={`${focusRing} group relative grid size-[clamp(13rem,calc(10.456rem_+_9.467vw),15rem)] cursor-pointer place-items-center overflow-hidden rounded-full bg-primary text-white`}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- the user's photo from storage or Google
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span aria-hidden="true" className="text-6xl font-light tracking-[-0.03em]">
                  {initials}
                </span>
              )}
              <span aria-hidden="true" className={`absolute inset-0 grid place-items-center bg-black/40 transition-opacity ${photoBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                {photoBusy ? <span className="size-7 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="size-7" strokeWidth={1.5} />}
              </span>
            </button>
          </div>

          <div className="text-center md:text-left">
            <p className="m-0 text-[0.9375rem] font-light text-foreground/50">Your account</p>
            <h1 className={`m-0 mt-2 ${fluidText.profileName} font-semibold leading-[1.05] tracking-[-0.035em]`}>{fullName || "Welcome"}</h1>
            <p className="m-0 mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-foreground/60 md:mx-0">
              {email}
              <br />
              Member of Portory since {since}.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
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
            {photoError && <div className="mt-3"><ErrorText text={photoError} /></div>}
          </div>
        </motion.header>

        <motion.div {...rise(0.12)} className="mt-20">
          <Section title="Account settings" text="Your name, how you sign in, and your account, all in one place.">
            <Item
              Icon={UserRound}
              title="Name"
              value={fullName || "Not set"}
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
            <Item Icon={Mail} title="Email" value={email} action={<span className="inline-flex h-9 items-center rounded border border-dashed border-foreground/15 px-3.5 text-[0.8125rem] text-foreground/45">Changing email · coming soon</span>} />
            <Item
              Icon={KeyRound}
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
                  <p className="m-0 text-[0.8125rem] text-foreground/45">{MIN_PASSWORD_LENGTH} or more letters, numbers and symbols.</p>
                  <button type="button" aria-pressed={showPasswords} onClick={() => setShowPasswords((value) => !value)} className={`${focusRing} inline-flex cursor-pointer items-center gap-1.5 rounded text-[0.8125rem] text-foreground/55 transition-colors hover:text-foreground`}>
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
              title="Sign-in methods"
              value={hasPassword ? "You log in with your email and password." : "You log in with your Google account."}
              action={
                <span className="flex flex-wrap gap-1.5">
                  {hasPassword && <span className="rounded-md bg-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground/70 ring-1 ring-black/[0.06]">Email</span>}
                  {props.withGoogle && <span className="rounded-md bg-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-foreground/70 ring-1 ring-black/[0.06]">Google</span>}
                </span>
              }
            />
            <Item
              Icon={LogOut}
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
        </motion.div>
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
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)]"
            >
              <Check aria-hidden="true" className="size-4 text-emerald-400" strokeWidth={2.5} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deleting, confirmed by typing DELETE */}
      <Modal open={confirmOpen} onClose={closeConfirm} labelledBy="delete-confirm-title" describedBy="delete-confirm-text" alert>
        <form onSubmit={deleteAccount}>
          <h2 id="delete-confirm-title" className="m-0 pr-8 text-[1.625rem] font-medium leading-tight tracking-[-0.02em]">
            Delete your account?
          </h2>
          <p id="delete-confirm-text" className="m-0 mt-3 text-sm leading-relaxed text-neutral-600">
            Your account, your portfolio and your images will be deleted for good. Type <strong className="font-semibold text-neutral-950">DELETE</strong> to confirm.
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
