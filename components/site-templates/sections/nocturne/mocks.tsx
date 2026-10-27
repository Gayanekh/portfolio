"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, Check, ChevronRight, LayoutGrid, Search, Star, Users } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { ease } from "./kit";

// Interfaces drawn in code for the UI/UX case studies: a phone booking flow,
// an admin dashboard and a design-system sheet. They are artwork (their words
// are part of the drawing), coloured only with the theme's tokens so a palette
// restyles them, and their parts build in one after another once in view.

// Children that appear one after another once their parent is in view.
const sheet = { hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } };
const piece = { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

function Build({ children, className }: { children: ReactNode; className?: string }) {
  const still = useReducedMotion();
  return (
    <motion.div className={className} variants={sheet} initial={still ? false : "hidden"} whileInView="shown" viewport={{ once: true, margin: "0px 0px -15% 0px" }}>
      {children}
    </motion.div>
  );
}

function Part({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={piece}>
      {children}
    </motion.div>
  );
}

const screen = "rounded-[10px] border border-solid border-border bg-[color-mix(in_srgb,var(--card),var(--foreground)_4%)]";
const tile = "rounded-lg border border-solid border-border bg-card";

/* ---------- A phone: booking ---------- */

export function PhoneMock({ imageField }: { imageField: string }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[34rem] items-center justify-center py-6">
      <div className="relative w-[15.5rem] rounded-[2.4rem] border border-solid border-foreground/20 bg-card p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="absolute left-1/2 top-3.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground/10" />
        <Build className="flex flex-col gap-3 overflow-hidden rounded-[2rem] bg-[color-mix(in_srgb,var(--card),var(--foreground)_5%)] px-4 pb-5 pt-10 text-[10px]">
          <Part className="flex items-center gap-2 rounded-full border border-solid border-border px-3 py-2 text-muted-foreground">
            <Search className="size-3" /> Cardiology in Yerevan
          </Part>
          <Part className={`flex gap-3 p-3 ${tile}`}>
            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-foreground/10">
              <FieldPicture field={imageField} className="absolute inset-0 block h-full w-full object-cover" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[11px] font-semibold text-foreground">Dr. Ani Petrosyan</span>
              <span className="text-muted-foreground">Cardiologist · 14 yrs</span>
              <span className="flex items-center gap-1 text-foreground">
                <Star className="size-2.5 fill-primary text-primary" /> 4.9 <span className="text-muted-foreground">(212)</span>
              </span>
            </span>
          </Part>
          <Part className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Select a date</span>
            <div className="grid grid-cols-4 gap-1.5">
              {["Mon 12", "Tue 13", "Wed 14", "Thu 15"].map((day, i) => (
                <span key={day} className={`flex flex-col items-center rounded-lg py-1.5 ${i === 1 ? "bg-primary text-card" : "border border-solid border-border text-muted-foreground"}`}>
                  <span>{day.split(" ")[0]}</span>
                  <span className="text-[12px] font-semibold">{day.split(" ")[1]}</span>
                </span>
              ))}
            </div>
          </Part>
          <Part className="grid grid-cols-3 gap-1.5">
            {["09:00", "10:30", "11:15", "13:00", "14:45", "16:30"].map((slot, i) => (
              <span key={slot} className={`rounded-md py-1.5 text-center ${i === 3 ? "border border-solid border-primary text-primary" : "bg-foreground/5 text-muted-foreground"}`}>
                {slot}
              </span>
            ))}
          </Part>
          <Part className="mt-1 flex items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-[11px] font-semibold text-card">
            Book consultation <ChevronRight className="size-3" />
          </Part>
        </Build>
      </div>
      {/* A confirmation, rising beside the phone */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 1.1 }}
        className={`absolute bottom-[18%] right-0 hidden w-[12.5rem] items-center gap-3 p-3 text-[10px] shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] @xl:flex ${tile}`}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <Check className="size-4" />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold text-foreground">Appointment confirmed</span>
          <span className="text-muted-foreground">Tue 13 · 13:00</span>
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 1.4 }}
        className={`absolute left-0 top-[16%] hidden items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground @xl:flex ${tile}`}
      >
        <Bell className="size-3 text-primary" /> Reminder set for 12:00
      </motion.div>
    </div>
  );
}

/* ---------- A dashboard ---------- */

const BARS = [38, 62, 48, 80, 56, 92, 70, 84, 60, 96, 74, 88];
const ROWS = [
  ["Aurora Clinic", "Facility", "Approved"],
  ["Dr. Levon Hakobyan", "Doctor", "Review"],
  ["MedLine Center", "Facility", "Approved"],
  ["Dr. Mariam Sargsyan", "Doctor", "Pending"],
];

export function DashboardMock() {
  const still = useReducedMotion();
  return (
    <div className={`w-full overflow-hidden shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ${screen}`}>
      <div className="flex items-center gap-2 border-0 border-b border-solid border-border px-4 py-2.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2 rounded-full bg-foreground/15" />
        ))}
        <span className="ml-3 rounded-md bg-foreground/5 px-3 py-0.5 font-mono text-[9px] text-muted-foreground">admin.zema.health/overview</span>
      </div>
      <div className="flex text-[10px]">
        <div className="hidden w-[22%] flex-col gap-1 border-0 border-r border-solid border-border p-3 @xl:flex">
          {[
            [LayoutGrid, "Overview"],
            [Users, "Providers"],
            [Bell, "Requests"],
          ].map(([Icon, name], i) => {
            const I = Icon as typeof LayoutGrid;
            return (
              <span key={name as string} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground"}`}>
                <I className="size-3" /> {name as string}
              </span>
            );
          })}
        </div>
        <Build className="flex flex-1 flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Bookings", "1,284", "+12.4%"],
              ["Providers", "312", "+4.1%"],
              ["Approval time", "6.2h", "−18%"],
            ].map(([name, value, delta]) => (
              <Part key={name} className={`flex flex-col gap-1 p-2.5 ${tile}`}>
                <span className="text-muted-foreground">{name}</span>
                <span className="font-display text-[18px] leading-none text-foreground">{value}</span>
                <span className="text-primary">{delta}</span>
              </Part>
            ))}
          </div>
          <Part className={`flex flex-col gap-2 p-3 ${tile}`}>
            <span className="flex justify-between text-muted-foreground">
              <span>Bookings, last 12 weeks</span>
              <span className="font-mono">W1–W12</span>
            </span>
            <div className="flex h-20 items-end gap-1.5">
              {BARS.map((height, i) => (
                <motion.span
                  key={i}
                  initial={still ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease, delay: 0.5 + i * 0.05 }}
                  className={`flex-1 origin-bottom rounded-t-sm ${i === 9 ? "bg-primary" : "bg-foreground/20"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </Part>
          <Part className={`overflow-hidden ${tile}`}>
            {ROWS.map(([name, kind, status]) => (
              <span key={name} className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-2 border-0 border-b border-solid border-border px-3 py-2 last:border-b-0">
                <span className="truncate text-foreground">{name}</span>
                <span className="text-muted-foreground">{kind}</span>
                <span className={`rounded-full px-2 py-0.5 ${status === "Approved" ? "bg-primary/15 text-primary" : "bg-foreground/[0.07] text-muted-foreground"}`}>{status}</span>
              </span>
            ))}
          </Part>
        </Build>
      </div>
    </div>
  );
}

/* ---------- A design-system sheet ---------- */

export function SystemMock() {
  const still = useReducedMotion();
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => setOn((o) => !o), 1800);
    return () => window.clearInterval(timer);
  }, [still]);

  return (
    <Build className={`grid w-full grid-cols-2 gap-3 p-4 text-[10px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ${screen}`}>
      <Part className={`col-span-2 flex flex-wrap items-center gap-2 p-3 ${tile}`}>
        <span className="mr-auto font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Button</span>
        <span className="rounded-md bg-primary px-3 py-1.5 font-semibold text-card">Primary</span>
        <span className="rounded-md border border-solid border-foreground/30 px-3 py-1.5 text-foreground">Secondary</span>
        <span className="rounded-md px-3 py-1.5 text-foreground underline underline-offset-2">Ghost</span>
        <span className="rounded-md bg-foreground/10 px-3 py-1.5 text-foreground/30">Disabled</span>
      </Part>
      <Part className={`flex flex-col gap-1.5 p-3 ${tile}`}>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Input · focus</span>
        <span className="text-foreground">Email address</span>
        <span className="flex items-center rounded-md border border-solid border-primary px-2.5 py-2 text-foreground shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]">
          ani@zema.health
          <motion.span animate={still ? undefined : { opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="ml-px h-3 w-px bg-foreground" />
        </span>
        <span className="text-muted-foreground">We&apos;ll send the confirmation here.</span>
      </Part>
      <Part className={`flex flex-col gap-2.5 p-3 ${tile}`}>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Controls</span>
        <span className="flex items-center justify-between text-foreground">
          Notifications
          <span className={`flex h-4 w-7 items-center rounded-full p-0.5 transition-colors duration-500 ${on ? "bg-primary" : "bg-foreground/20"}`}>
            <motion.span animate={{ x: on ? 12 : 0 }} transition={{ duration: 0.4, ease }} className="size-3 rounded-full bg-card" />
          </span>
        </span>
        <span className="flex items-center gap-2 text-foreground">
          <span className="grid size-3.5 place-items-center rounded-[4px] bg-primary text-card">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
          Remember me
        </span>
        <span className="flex flex-wrap gap-1">
          {["Cardiology", "Dental", "MRI"].map((chip, i) => (
            <span key={chip} className={`rounded-full px-2 py-0.5 ${i === 0 ? "bg-foreground text-card" : "border border-solid border-border text-muted-foreground"}`}>
              {chip}
            </span>
          ))}
        </span>
      </Part>
      <Part className={`flex items-end justify-between p-3 ${tile}`}>
        <span className="flex items-end gap-3 text-foreground">
          <span className="font-display text-[34px] leading-none">Aa</span>
          <span className="flex flex-col font-mono text-[9px] text-muted-foreground">
            <span>Display 48/52</span>
            <span>Body 15/24</span>
          </span>
        </span>
      </Part>
      <Part className={`flex items-center gap-1.5 p-3 ${tile}`}>
        {["bg-primary", "bg-foreground", "bg-muted-foreground", "bg-border", "bg-card"].map((swatch) => (
          <span key={swatch} className={`h-8 flex-1 rounded-md border border-solid border-border ${swatch}`} />
        ))}
      </Part>
    </Build>
  );
}
