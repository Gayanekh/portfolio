"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { END, TEMPLATES_ALL } from "@/components/template-landing/content";
import { Words } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, dots, ease, focusRing, frame, grid, type } from "@/components/template-landing/ui";
import { scrollPageTo } from "@/lib/scroll";

// Each card's place on the arc, outside in: turned towards the middle and
// brought forward at the ends, as if seen from inside a cylinder.
const ARC = [
  "[transform:rotateY(42deg)_translateZ(90px)]",
  "[transform:rotateY(24deg)_translateZ(30px)]",
  "[transform:rotateY(8deg)]",
  "[transform:rotateY(-8deg)]",
  "[transform:rotateY(-24deg)_translateZ(30px)]",
  "[transform:rotateY(-42deg)_translateZ(90px)]",
];

// The end of the page, the home page's close and footer: "Create with
// Portory" over two columns with Browse templates and the footer's line, and
// the site's links in the last two; then the templates on a
// gentle arc (each lifting under the pointer and opening its demo) over a
// halftone field; then the copyright and a round "back to top" badge whose
// words turn slowly around it.
export default function End() {
  const still = useReducedMotion();
  return (
    <footer data-caption="end" className="relative z-10 border-0 border-t border-solid border-[var(--line)] pt-[clamp(4rem,10vh,7rem)]">
      <div className={`${frame} ${grid} gap-y-10`}>
        <div className="flex flex-col gap-8 lg:col-span-2">
          <p className={`m-0 ${type.title}`}>
            <span className="block text-[var(--dim)]">
              <Words text={END.lead} />
            </span>
            <span className="block">
              <Words text={END.name} delay={0.15} />
            </span>
          </p>
          <p className={`m-0 max-w-[26rem] ${type.lead}`}>{END.tagline}</p>
          <Link href={END.start.href} className={`${cornerLink} text-[1.25rem]`}>
            {END.start.label}
            <span aria-hidden="true" className={corner} />
          </Link>
        </div>
        {END.groups.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-2 lg:px-[clamp(1rem,1.75vw,2rem)]">
            <p className={`m-0 ${type.name}`}>{group.title}</p>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${focusRing} rounded-[4px] ${type.body} text-[var(--dim)] no-underline transition-colors hover:text-[var(--fg)]`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* The templates on an arc, over a halftone field. */}
      <div className="relative mt-[clamp(3rem,8vh,6rem)] overflow-hidden">
        <span aria-hidden="true" className={`absolute inset-0 ${dots} [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000,transparent_75%)]`} />
        <ul className={`relative m-0 flex list-none justify-center gap-[clamp(0.5rem,1.2vw,1.25rem)] p-0 py-[clamp(2rem,5vh,4rem)] [perspective:1400px] ${frame}`}>
          {TEMPLATES_ALL.slice(0, ARC.length).map((room, i) => (
            <motion.li
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease, delay: i * 0.06 }}
              className={`hidden w-[clamp(7rem,14vw,15rem)] shrink-0 [transform-style:preserve-3d] sm:block ${i === 2 || i === 3 ? "!block" : ""}`}
            >
              <Link
                href={room.href}
                target="_blank"
                rel="noopener"
                aria-label={`Open the ${room.name} demo (new tab)`}
                className={`${focusRing} group/arc block rounded-[10px] no-underline [transform-style:preserve-3d] ${ARC[i]}`}
              >
                <span className="relative block aspect-[3/4] overflow-hidden rounded-[10px] border border-solid border-[var(--fg)] bg-[var(--card)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arc:-translate-y-3">
                  <Image src={room.square} alt="" fill sizes="15rem" className="object-cover transition-transform duration-700 group-hover/arc:scale-105" />
                </span>
                <span className={`mt-2 block ${type.small} text-[var(--fg)]`}>{room.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Clear of the fixed theme switch and caption in the corners below. */}
      <div className={`${frame} flex items-end justify-between gap-6 pb-[clamp(1.5rem,4vh,2.5rem)] pt-6 sm:pb-[5.5rem] sm:pl-[clamp(7rem,9vw,8rem)]`}>
        <p className={`m-0 ${type.small} text-[var(--dim)]`}>{END.copyright}</p>
        <button type="button" onClick={() => scrollPageTo(0)} aria-label="Back to top" className={`${focusRing} group/top relative grid size-[6.5rem] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[var(--fg)]`}>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            animate={still ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <path id="tl-top-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-current text-[10px] uppercase tracking-[0.18em]">
              <textPath href="#tl-top-ring">{END.top}</textPath>
            </text>
          </motion.svg>
          <ArrowUp aria-hidden="true" strokeWidth={1.25} className="size-6 transition-transform duration-300 group-hover/top:-translate-y-1" />
        </button>
      </div>
    </footer>
  );
}
