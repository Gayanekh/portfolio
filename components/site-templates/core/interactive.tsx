"use client";

import { Children, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { FieldPicture } from "./blocks";
import { useField, useMediaMeta, useTemplate } from "./context";
import { scrollParent, viewOf } from "./scroll";

// Interactive blocks, for pages that respond to the visitor: text that lights
// up as it is read, a list whose rows open, a moving band of names, a copy
// button and service cards. Like the rest of the kit they take fields and theme tokens
// only, and show everything still for visitors who ask for reduced motion.

const ease = [0.22, 1, 0.36, 1] as const;
const soft = [0.65, 0, 0.35, 1] as const;

/* ---------- Text lighting up as it is read ---------- */

// 0 while the element's top is low on the screen, 1 once its end has risen
// past the middle: the stretch of scrolling over which it is read.
function useReadProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      const view = viewOf(parent);
      const box = element.getBoundingClientRect();
      const start = view.top + view.height * 0.85;
      const end = view.top + view.height * 0.45;
      const read = (start - box.top) / (start - end + box.height);
      progress.set(Math.min(1, Math.max(0, read)));
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress]);
  return progress;
}

function Word({ word, index, count, progress, marked, joined }: { word: string; index: number; count: number; progress: MotionValue<number>; marked: boolean; joined: boolean }) {
  const lit = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
  const opacity = useTransform(lit, [0, 1], [0.16, 1]);
  const color = useTransform(lit, (v) => (v > 0.5 ? "var(--card)" : "currentColor"));
  const markedOpacity = useTransform(lit, [0, 0.3], [0.16, 1]);
  if (!marked) return <motion.span style={{ opacity }}>{word} </motion.span>;
  // A marked word: the accent sweeps in behind it as it lights, its text
  // turning light; the bar runs on through the space to the next marked word.
  return (
    <>
      <motion.span style={{ opacity: markedOpacity, color }} className="relative isolate inline-block">
        <motion.span aria-hidden="true" style={{ scaleX: lit }} className="absolute -inset-x-[0.06em] inset-y-[0.08em] -z-10 origin-left bg-primary" />
        {word}
        {joined && "\u00a0"}
      </motion.span>
      {!joined && " "}
    </>
  );
}

// The words of a text, each marked if it sits between ** and **.
function markedWords(value: string) {
  const words: { word: string; marked: boolean }[] = [];
  value.split("**").forEach((part, i) => {
    part.split(/\s+/).filter(Boolean).forEach((word) => words.push({ word, marked: i % 2 === 1 }));
  });
  return words;
}

// A statement in large type whose words light up one after another as the
// visitor scrolls through it; phrases written between ** and ** are marked,
// an accent highlighter sweeping across them. While editing, plain text.
export function ScrollText({ field }: { field: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { value, editing, node } = useField(field);
  const progress = useReadProgress(ref);
  const still = useReducedMotion();
  const words = markedWords(value);
  const plain = words.map(({ word }) => word).join(" ");
  return (
    <p ref={ref} className="m-0 max-w-[48rem] text-[length:clamp(1.6rem,3cqw,3.1rem)] font-medium leading-[1.12] tracking-[-0.03em]">
      {editing
        ? node
        : still
          ? plain
          : words.map(({ word, marked }, i) => (
              <Word key={i} word={word} index={i} count={words.length} progress={progress} marked={marked} joined={marked && Boolean(words[i + 1]?.marked)} />
            ))}
    </p>
  );
}

/* ---------- A list whose rows open ---------- */

export interface ExpandItem {
  // Fields: the row's title, a note beside it, a date at its end, and the
  // text shown once it is open.
  title: string;
  note: string;
  date: string;
  text: string;
}

// One row: its number, title, note and date in a line, and a plus turning
// into a cross. Hovering sweeps the accent across it and turns its text
// light; following it opens its text.
function ExpandRow({ item, index, open, onToggle, editing }: { item: ExpandItem; index: number; open: boolean; onToggle: () => void; editing: boolean }) {
  const title = useField(item.title).node;
  const note = useField(item.note).node;
  const date = useField(item.date).node;
  const text = useField(item.text).node;
  const still = useReducedMotion();
  const id = `${item.title}-panel`;
  const line = (
    <>
      {/* The accent sweeping in on hover */}
      <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/row:scale-x-100" />
      <span className="relative grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 px-1 py-6 transition-colors duration-300 group-hover/row:text-card @xl:grid-cols-[3rem_1.2fr_1fr_auto_2rem] @xl:px-3 @xl:py-7">
        <span className="col-start-1 row-start-1 text-[11px] font-medium tabular-nums tracking-[0.08em] text-muted-foreground transition-colors duration-300 group-hover/row:text-card/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="col-start-2 row-start-1 font-display text-[length:clamp(1.4rem,2.4cqw,2.4rem)] font-black uppercase leading-none tracking-[-0.03em]">{title}</span>
        <span className="col-start-2 row-start-2 text-sm text-muted-foreground transition-colors duration-300 group-hover/row:text-card/80 @xl:col-start-3 @xl:row-start-1">{note}</span>
        <span className="col-start-3 row-start-1 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.08em] tabular-nums @xl:col-start-4">{date}</span>
        <span aria-hidden="true" className="relative col-start-5 row-start-1 hidden size-4 @xl:block">
          <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
          <motion.span animate={{ rotate: open ? 0 : 90 }} transition={{ duration: 0.4, ease }} className="absolute inset-x-0 top-1/2 h-px bg-current" />
        </span>
      </span>
    </>
  );
  return (
    <li className="border-0 border-solid border-foreground/15 [&:not(:first-child)]:border-t">
      {editing ? (
        <div className="group/row relative">{line}</div>
      ) : (
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className="group/row relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-foreground">
          {line}
        </button>
      )}
      <AnimatePresence initial={false}>
        {(open || editing) && (
          <motion.div
            id={id}
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: soft }}
            className="overflow-hidden"
          >
            <div className="max-w-[40rem] pb-8 pl-[calc(2.5rem+1rem)] text-[length:clamp(1rem,1.25cqw,1.25rem)] font-medium leading-snug tracking-[-0.01em] @xl:pl-[calc(3rem+1rem+0.75rem)]">
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// Rows that open one at a time, the first open to begin with. While editing
// they are all open, so every text can be typed into.
export function ExpandList({ items }: { items: ExpandItem[] }) {
  const editing = Boolean(useTemplate().edit);
  const [open, setOpen] = useState(0);
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item, index) => (
        <ExpandRow key={item.title} item={item} index={index} open={open === index} editing={editing} onToggle={() => setOpen((o) => (o === index ? -1 : index))} />
      ))}
    </ul>
  );
}

/* ---------- A moving band of names ---------- */

// Its children in a band running right to left without end, edge to edge
// (in a `rail` Section with `clip`), a small accent square between them. It
// slows down while hovered. For reduced motion, and while editing, the
// names simply wrap.
export function Marquee({ children, speed = 60 }: { children: ReactNode; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [hovered, setHovered] = useState(false);
  const still = useReducedMotion();
  const editing = Boolean(useTemplate().edit);
  const moving = !still && !editing;
  const rate = useRef(1);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!moving || !track) return;
    // Ease towards a crawl while hovered, back to speed after.
    rate.current += ((hovered ? 0.15 : 1) - rate.current) * Math.min(1, delta / 300);
    const half = track.scrollWidth / 2;
    let next = x.get() - (speed * rate.current * delta) / 1000;
    if (half > 0 && -next >= half) next += half;
    x.set(next);
  });

  const items = Children.toArray(children).map((child, i) => (
    <span key={i} className="flex shrink-0 items-center gap-[3cqw] pr-[3cqw]">
      {child}
      <span aria-hidden="true" className="size-2.5 bg-primary" />
    </span>
  ));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="-mx-5 overflow-hidden border-0 border-y border-solid border-foreground/15 py-6 @xl:-ml-[calc(9cqw+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))] @xl:-mr-[calc(max(9cqw,7.5rem)+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))] @xl:py-8"
    >
      {moving ? (
        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          {items}
          {/* The same names again, so the band never runs out */}
          <span aria-hidden="true" className="flex">
            {items}
          </span>
        </motion.div>
      ) : (
        <div className="flex flex-wrap px-5 @xl:px-[9cqw]">{items}</div>
      )}
    </div>
  );
}

/* ---------- Copy ---------- */

// A small pill copying the field's text (such as an email address), saying
// so for a moment once it has.
export function CopyButton({ field, label = "Copy", done = "Copied" }: { field: string; label?: string; done?: string }) {
  const { value } = useField(field);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard not allowed: the address stays a mail link beside it.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="relative inline-flex h-9 cursor-pointer items-center overflow-hidden rounded-full border border-solid border-foreground/20 bg-transparent px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground transition-colors duration-300 hover:border-foreground"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={copied ? "done" : "copy"} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, ease }}>
          {copied ? done : label}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? done : ""}
      </span>
    </button>
  );
}

/* ---------- Service cards ---------- */

export interface ServiceCard {
  // Fields: the service's name, a few words about it, its image, and the
  // skills behind it (empty ones are left out of the page).
  name: string;
  text: string;
  image: string;
  skills: string[];
}

// One skill as a boxed badge, as the hero's tags.
function Badge({ field }: { field: string }) {
  const { value, editing, node } = useField(field);
  if (!value && !editing) return null;
  return <li className="border border-solid border-foreground/20 px-3 py-2 text-[12px] leading-none tracking-[0.03em]">{node}</li>;
}

// How wide each card is in turn (of 12 columns): narrow and wide, then wide
// and narrow, so the rows interlock.
const SPANS = ["@xl:col-span-5", "@xl:col-span-7", "@xl:col-span-7", "@xl:col-span-5"];

function Service({ card, index }: { card: ServiceCard; index: number }) {
  const name = useField(card.name);
  const imageHidden = useMediaMeta(card.image)?.hidden;
  const text = useField(card.text).node;
  const still = useReducedMotion();
  const ended = !name.value || /[.!?]$/.test(name.value);
  return (
    <motion.li
      initial={still ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease, delay: (index % 2) * 0.12 }}
      className={`group/card flex flex-col gap-5 bg-foreground/[0.04] p-3 @xl:p-4 ${SPANS[index % SPANS.length]}`}
    >
      {/* The card's image box, gone with its image when that is deleted */}
      {!imageHidden && (
      <div className="relative h-[clamp(14rem,24cqw,24rem)] overflow-hidden bg-foreground/[0.06]">
        <FieldPicture
          field={card.image}
          alt={name.value}
          className="block h-full w-full object-cover contrast-[1.05] grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04] group-hover/card:grayscale-0"
        />
        <span className="absolute left-3 top-3 bg-card px-2 py-1 text-[11px] font-medium tabular-nums tracking-[0.08em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      )}
      <div className="flex flex-col gap-3 px-1 pb-2 @xl:px-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className="m-0 font-display text-[length:clamp(1.4rem,2cqw,2.1rem)] font-bold uppercase leading-none tracking-[-0.03em]">
            {name.editing ? name.node : ended ? name.value : `${name.value}.`}
          </h3>
          <span aria-hidden="true" className="size-2.5 shrink-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:rotate-45" />
        </div>
        <p className="m-0 max-w-[32rem] text-[15px] leading-relaxed text-muted-foreground">{text}</p>
        <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
          {card.skills.map((skill) => (
            <Badge key={skill} field={skill} />
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

// Services as cards in interlocking rows (narrow and wide, then wide and
// narrow; one to a row on phones): an image, black and white until pointed
// at (then in colour, zooming gently), its number, its name in capitals and
// a few words, and the skills behind it as badges. The cards rise in as
// they come into view.
export function ServiceCards({ cards }: { cards: ServiceCard[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 @xl:grid-cols-12">
      {cards.map((card, index) => (
        <Service key={card.name} card={card} index={index} />
      ))}
    </ul>
  );
}

/* ---------- A figure counting up ---------- */

// A figure such as "10+" and its label: the number counts up from zero once
// it comes into view, keeping what comes before and after it ("+", "%").
// While editing, and for reduced motion, it shows as written.
export function Stat({ field, labelField }: { field: string; labelField: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { value, editing, node } = useField(field);
  const label = useField(labelField).node;
  const still = useReducedMotion();
  const [shown, setShown] = useState<string | null>(null);
  const match = value.match(/^(\D*)(\d+)(.*)$/);

  useEffect(() => {
    const element = ref.current;
    if (!element || !match || still || editing) return;
    const [, before, digits, after] = match;
    const target = Number(digits);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1600);
          const eased = 1 - (1 - t) ** 3;
          setShown(`${before}${Math.round(target * eased)}${after}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(`${before}0${after}`);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // Counts again only if the figure itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, still, editing]);

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <span className="font-display text-[length:clamp(2.75rem,5cqw,5rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">
        {editing ? node : (shown ?? value)}
      </span>
      <span className="max-w-[12rem] text-sm leading-snug opacity-75">{label}</span>
    </div>
  );
}

/* ---------- An index pinned while it fills ---------- */

export interface IndexItem {
  // Fields: the row's title, a note under it, a date by its number, and a
  // few words at its end.
  title: string;
  note: string;
  date: string;
  text: string;
}

// The desktop layout starts at 36rem of page width (the kit's @xl).
function useDesktop(ref: RefObject<HTMLElement | null>) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const element = ref.current;
    const page = element?.closest("[data-site-template]") as HTMLElement | null;
    if (!element) return;
    const measure = () => setDesktop((page ?? element).clientWidth >= 576);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page ?? element);
    return () => observer.disconnect();
  }, [ref]);
  return desktop;
}

function IndexRow({
  item,
  index,
  progress,
  moving,
  dimmed,
  onPoint,
}: {
  item: IndexItem;
  index: number;
  progress: MotionValue<number>;
  moving: boolean;
  dimmed: boolean;
  onPoint: (on: boolean) => void;
}) {
  const title = useField(item.title).node;
  const note = useField(item.note).node;
  const date = useField(item.date).node;
  const text = useField(item.text).node;
  // How far this row has come in: 0 waiting off to the right, 1 in place.
  const local = useTransform(progress, (p) => Math.min(1, Math.max(0, p - index)));
  const x = useTransform(local, [0, 1], ["100%", "0%"]);
  const opacity = useTransform(local, [0, 0.7, 1], [0, 0.4, 1]);
  return (
    <li
      onMouseEnter={() => onPoint(true)}
      onMouseLeave={() => onPoint(false)}
      className={`overflow-hidden transition-opacity duration-300 ${dimmed ? "@xl:opacity-30" : ""}`}
    >
      <motion.div style={moving ? { x, opacity } : undefined}>
        <div className="grid grid-cols-1 items-baseline gap-y-3 py-7 @xl:grid-cols-5 @xl:gap-x-[2cqw] @xl:py-[2.6svh]">
          <span className="flex gap-4 text-[13px] tabular-nums @xl:flex-col @xl:gap-1.5">
            <span className="opacity-50">{String(index + 1).padStart(2, "0")}</span>
            <span className="opacity-50">{date}</span>
          </span>
          <span className="flex flex-col gap-2 @xl:col-span-2">
            <span className="font-display text-[length:clamp(1.5rem,2.3cqw,2.5rem)] font-medium leading-none tracking-[-0.03em]">{title}</span>
            <span className="text-sm opacity-60">{note}</span>
          </span>
          <span className="max-w-[46ch] text-[15px] leading-relaxed opacity-70 @xl:col-span-2">{text}</span>
        </div>
        {/* Its line travels in with it */}
        <div aria-hidden="true" className="h-[1.5px] bg-current opacity-20" />
      </motion.div>
    </li>
  );
}

// An index of rows (a number with a date, a title with a note, a few words,
// five columns wide, a thin line under each) under a `heading`, on a screen
// that stays pinned while the page scrolls through it. At first only the
// heading and its line show; scrolling down, the rows slide in from the
// right one after another, faint at first, settling into place; scrolling
// up, they slide back out to the right until only the heading is left.
// Pointing at a row fades the others back. On phones, while editing and for
// reduced motion, the rows simply follow one another.
export function PinnedIndex({ heading, items }: { heading: ReactNode; items: IndexItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const editing = Boolean(useTemplate().edit);
  const desktop = useDesktop(ref);
  const moving = desktop && !still && !editing;
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 220, damping: 34, mass: 0.5 });
  const [pointed, setPointed] = useState(-1);

  // How many rows have come in, from how far the page has scrolled through.
  useEffect(() => {
    const element = ref.current;
    if (!element || !moving) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      const view = viewOf(parent);
      const box = element.getBoundingClientRect();
      // From when the screen's top passes the middle of the view (so the
      // rows start coming in while it is still rising into place) until a
      // little before it moves on, the last row settled.
      const start = view.height * 0.5;
      const travel = box.height - view.height + start;
      const passed = travel > 0 ? (view.top + start - box.top) / travel : 0;
      progress.set(Math.min(1, Math.max(0, passed / 0.9)) * items.length);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [moving, items.length, progress]);

  return (
    <div ref={ref} className="relative" style={moving ? { height: `calc(100svh + ${items.length * 20}svh)` } : undefined}>
      <div className={moving ? "sticky top-0 flex h-[100svh] flex-col justify-center" : "py-16"}>
        {heading}
        <div aria-hidden="true" className="mt-8 h-[1.5px] bg-current opacity-20 @xl:mt-[3svh]" />
        <ul className="m-0 list-none p-0">
          {items.map((item, index) => (
            <IndexRow
              key={item.title}
              item={item}
              index={index}
              progress={smooth}
              moving={moving}
              dimmed={pointed !== -1 && pointed !== index}
              onPoint={(on) => setPointed((current) => (on ? index : current === index ? -1 : current))}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Note tiles ---------- */

function NoteTile({ field, index }: { field: string; index: number }) {
  const text = useField(field).node;
  const still = useReducedMotion();
  return (
    <motion.li
      initial={still ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease, delay: index * 0.1 }}
      className="group/note relative overflow-hidden bg-foreground/[0.04]"
    >
      {/* The accent sweeping up on hover */}
      <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/note:scale-y-100" />
      <div className="relative flex h-full flex-col gap-10 p-6 transition-colors duration-500 group-hover/note:text-card @xl:p-[2cqw]">
        <span className="font-display text-[length:clamp(1.75rem,2.6cqw,2.75rem)] font-bold leading-none tracking-[-0.04em] text-primary transition-colors duration-500 group-hover/note:text-card">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="m-0 mt-auto text-[15px] leading-relaxed text-muted-foreground transition-colors duration-500 group-hover/note:text-card/90">{text}</p>
      </div>
    </motion.li>
  );
}

// Short texts as soft tiles side by side, each with its number large in the
// accent; pointing at one, the accent sweeps up through it and its text turns
// light. They rise in one after another.
export function NoteTiles({ fields }: { fields: string[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 @xl:grid-cols-3">
      {fields.map((field, index) => (
        <NoteTile key={field} field={field} index={index} />
      ))}
    </ul>
  );
}
