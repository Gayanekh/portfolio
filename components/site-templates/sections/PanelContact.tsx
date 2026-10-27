"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { readField } from "../core/content";
import { useField, useSectionId, useTemplate } from "../core/context";
import { plainText } from "../core/rich-format";
import { AccentNumber, arrowIcon, ease, FieldValue, Marquee, PanelFrame, PanelTitle, pageSections, Rise, type } from "./panel-kit";

// Contact, the last page, in the hero's panels:
//
//   [ eyebrow ][                     ][ ● available   ][ 07 ]
//   [ contact (huge)                 ][                     ]
//   [ studio, ][ lead, email (large),][ the booking form    ]
//   [ phone   ][ links               ][                     ]
//   [ @handle ][ pictures running right to left ...         ]
//   [ ©       ][                     ][ credit        ][ ↑  ]
//
// The form opens the visitor's email app with the message written out (the
// kind of shoot picked from chips); the pictures run without end, slowing
// while pointed at; ↑ glides back to the top of the page.
//
// Its section's fields: `eyebrow`, `title`, `status`, `lead`, `email`,
// `phone`, `studioLabel`, `studio`, `phoneLabel`, `social1Label` and
// `social1Url`...; the form's `formName`, `formEmail`, `formType`,
// `formDate`, `formMessage`, `formSend`, `formSent`, `topic1`...; the strip's
// `handle`, `handleUrl`, `insta1Image`...; and `copyright`, `credit`, `top`.

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  status: "px-5 pt-4 @xl:col-start-3 @xl:row-start-1 @xl:self-start @xl:px-[2.6cqw] @xl:pt-[2.4cqw]",
  accent: "@xl:col-start-4 @xl:row-start-1",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:px-[3.2cqw]",
  details: "order-last flex flex-col gap-6 px-5 pb-12 pt-4 @xl:order-none @xl:col-start-1 @xl:row-start-3 @xl:px-[3.2cqw] @xl:pb-[10svh] @xl:pt-[8svh]",
  reach: "flex flex-col gap-[4svh] px-5 pt-10 @xl:col-start-2 @xl:row-start-3 @xl:pb-[10svh] @xl:pl-[3.3cqw] @xl:pr-[3cqw] @xl:pt-[8svh]",
  form: "px-5 pb-12 pt-12 @xl:col-span-2 @xl:col-start-3 @xl:row-start-3 @xl:px-[2.6cqw] @xl:pb-[10svh] @xl:pt-[8svh]",
  handle: "order-last flex items-center justify-between gap-4 px-5 pt-10 @xl:order-none @xl:col-start-1 @xl:row-start-4 @xl:flex-col @xl:items-start @xl:justify-center @xl:px-[3.2cqw] @xl:pt-0",
  strip: "order-last pt-4 @xl:order-none @xl:col-span-3 @xl:col-start-2 @xl:row-start-4 @xl:pt-0",
  copyright: "order-last px-5 pt-10 text-[12px] text-muted-foreground @xl:order-none @xl:col-start-1 @xl:row-start-5 @xl:self-center @xl:px-[3.2cqw] @xl:pt-0",
  credit: "order-last px-5 pb-6 pt-2 text-[12px] text-muted-foreground @xl:order-none @xl:col-span-2 @xl:col-start-2 @xl:row-start-5 @xl:self-center @xl:pl-[3.3cqw] @xl:pt-0 @xl:pb-0",
  top: "order-last @xl:order-none @xl:col-start-4 @xl:row-start-5",
};

const label = "text-[11px] uppercase tracking-[0.1em] text-muted-foreground";
const input =
  "w-full rounded-none border-0 border-b border-solid border-foreground/25 bg-transparent px-0 py-2.5 text-[15px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/30 focus:border-primary";

export default function PanelContact({ topics, socials, insta }: { topics: number[]; socials: number[]; insta: number[] }) {
  const { template, layout, content, edit, navigate } = useTemplate();
  const section = useSectionId();
  const read = (field: string) => plainText(readField(content, section, field));
  const email = read("email");
  const phone = read("phone");
  const handleUrl = read("handleUrl");
  const [topic, setTopic] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (edit || !email) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const kind = topic !== null ? read(`topic${topics[topic]}`) : "";
    const lines = [`${read("formName")}: ${value("name")}`, `${read("formEmail")}: ${value("email")}`];
    if (kind) lines.push(`${read("formType")}: ${kind}`);
    if (value("date")) lines.push(`${read("formDate")}: ${value("date")}`);
    const body = [...lines, "", value("message")].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent([kind, value("name")].filter(Boolean).join(" — ") || read("title"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <PanelFrame grid="@xl:grid-rows-[20svh_auto_auto_auto_20svh]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      {/* Availability, by a softly pulsing dot */}
      <div className={place.status}>
        <Rise delay={0.1}>
          <span className="inline-flex items-center gap-3 text-[13px]">
            <span className="relative grid size-2.5 place-items-center">
              <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary"
              />
              <span className="size-2.5 rounded-full bg-primary" />
            </span>
            <FieldValue field="status" />
          </span>
        </Rise>
      </div>

      <div className={place.accent}>
        <AccentNumber />
      </div>

      <div className={place.title}>
        <PanelTitle field="title" />
      </div>

      <div className={place.details}>
        {[
          ["studioLabel", "studio"],
          ["phoneLabel", "phone"],
        ].map(([name, value], i) => (
          <Rise key={name} delay={i * 0.08} className="flex flex-col gap-1.5">
            <span className={label}>
              <FieldValue field={name} />
            </span>
            {value === "phone" && !edit ? (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={`text-foreground no-underline hover:text-primary ${type.body}`}>
                <FieldValue field={value} />
              </a>
            ) : (
              <span className={type.body}>
                <FieldValue field={value} />
              </span>
            )}
          </Rise>
        ))}
      </div>

      <div className={place.reach}>
        <Rise>
          <p className={`m-0 max-w-[22rem] ${type.lead}`}>
            <FieldValue field="lead" />
          </p>
        </Rise>
        <Rise delay={0.1}>
          {/* The email, an underline drawing under it when pointed at */}
          <a
            href={edit ? undefined : `mailto:${email}`}
            className="group/mail relative inline-block break-all font-display text-[length:clamp(1.35rem,2.1cqw,2.1rem)] font-bold tracking-[-0.04em] text-foreground no-underline"
          >
            <FieldValue field="email" />
            <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-[2px] origin-right scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mail:origin-left group-hover/mail:scale-x-100" />
          </a>
        </Rise>
        <ul className="m-0 flex list-none flex-col p-0">
          {socials.map((n, i) => (
            <li key={n} className="border-0 border-b border-solid border-foreground/15">
              <Rise delay={0.15 + i * 0.06}>
                <SocialLink n={n} />
              </Rise>
            </li>
          ))}
        </ul>
      </div>

      {/* The booking form */}
      <form onSubmit={send} className={place.form}>
        <Rise className="grid grid-cols-1 gap-x-[2.6cqw] gap-y-7 @xl:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className={label}>
              <FieldValue field="formName" />
            </span>
            <input name="name" required autoComplete="name" className={input} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>
              <FieldValue field="formEmail" />
            </span>
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0 @xl:col-span-2">
            <legend className={`mb-3 p-0 ${label}`}>
              <FieldValue field="formType" />
            </legend>
            <div className="flex flex-wrap gap-2">
              {topics.map((n, i) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={topic === i}
                  onClick={() => setTopic(topic === i ? null : i)}
                  className={`cursor-pointer rounded border border-solid px-3.5 py-2 text-[13px] transition-colors duration-300 ${topic === i ? "border-primary bg-primary text-card" : "border-foreground/20 bg-transparent text-foreground hover:border-foreground"}`}
                >
                  <FieldValue field={`topic${n}`} />
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1 @xl:col-span-2">
            <span className={label}>
              <FieldValue field="formDate" />
            </span>
            <input name="date" className={input} />
          </label>
          <label className="flex flex-col gap-1 @xl:col-span-2">
            <span className={label}>
              <FieldValue field="formMessage" />
            </span>
            <textarea name="message" rows={4} className={`${input} resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-6 @xl:col-span-2">
            <button
              type="submit"
              className="group/link inline-flex h-[clamp(3.25rem,8svh,4.5rem)] cursor-pointer items-center gap-3 rounded border-0 bg-primary px-[clamp(1.5rem,2.4cqw,2.5rem)] text-[13px] font-medium uppercase tracking-[0.08em] text-card transition-colors duration-300 hover:bg-foreground"
            >
              <FieldValue field="formSend" />
              <ArrowRight aria-hidden="true" className={arrowIcon} strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {sent && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className={type.muted}>
                  <FieldValue field="formSent" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Rise>
      </form>

      {/* The Instagram strip */}
      <div className={place.handle}>
        <a href={edit ? undefined : handleUrl || undefined} target="_blank" rel="noreferrer" className="group/link flex items-center gap-1.5 font-display text-[length:clamp(1rem,1.3cqw,1.3rem)] font-bold tracking-[-0.02em] text-foreground no-underline">
          <FieldValue field="handle" />
          <ArrowUpRight aria-hidden="true" className="size-4 text-primary transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" strokeWidth={1.75} />
        </a>
      </div>
      <div className={place.strip}>
        <Marquee speed={40}>
          {insta.map((n) => (
            <span key={n} className="relative block aspect-square w-[clamp(8rem,15cqw,15rem)] shrink-0 overflow-hidden border-0 border-r border-solid border-card bg-foreground/[0.07]">
              <span className="absolute inset-0 transition-transform duration-700 hover:scale-110">
                <FieldPicture field={`insta${n}Image`} className="absolute inset-0 block h-full w-full object-cover" />
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* The footer */}
      <div className={place.copyright}>
        <FieldValue field="copyright" />
      </div>
      <div className={place.credit}>
        <FieldValue field="credit" />
      </div>
      <div className={place.top}>
        <button
          type="button"
          onClick={() => navigate(pageSections(template, layout)[0])}
          className="group/top flex h-full min-h-16 w-full cursor-pointer items-center justify-center gap-2 border-0 bg-primary text-[12px] font-medium uppercase tracking-[0.08em] text-card"
        >
          <FieldValue field="top" />
          <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/top:-translate-y-1" strokeWidth={1.5} />
        </button>
      </div>
    </PanelFrame>
  );
}

function SocialLink({ n }: { n: number }) {
  const { edit } = useTemplate();
  const url = useField(`social${n}Url`).value;
  return (
    <a
      href={edit ? undefined : url || undefined}
      target="_blank"
      rel="noreferrer"
      className="group/link flex items-center justify-between py-3 text-[14px] text-foreground no-underline transition-colors duration-300 hover:text-primary"
    >
      <FieldValue field={`social${n}Label`} />
      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" strokeWidth={1.5} />
    </a>
  );
}
