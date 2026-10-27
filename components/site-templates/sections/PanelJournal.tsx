"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useField, useTemplate } from "../core/context";
import { AccentNumber, arrowIcon, arrowLink, FieldValue, PanelFrame, PanelTitle, Rise, Sweep, type } from "./panel-kit";

// The journal, in Work's columns (the grey panel, then three equal ones):
//
//   [ eyebrow ][        title (huge)        ][      | 06 ]
//   [ intro   ][ story     ][ story         ][ story      ]
//   [ All →   ][ picture,  ][               ][            ]
//   [         ][ text      ][               ][            ]
//
// The pictures sweep open from below one after another, then the text drifts
// in; pointing at a story zooms its picture and slides its arrow.
//
// Its section's fields: `eyebrow`, `title`, `intro`, `allLabel`, `allUrl`,
// `readLabel`, and for each story (`post1`...): Category, Date, Title,
// Excerpt, Image and Url.

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-2 @xl:row-start-1 @xl:self-end @xl:px-[2.6cqw] @xl:pb-[5svh] @xl:pt-[10svh]",
  accent: "hidden @xl:col-start-4 @xl:row-start-1 @xl:block @xl:w-[43.4%] @xl:justify-self-end",
  side: "flex flex-col gap-6 px-5 pt-6 @xl:col-start-1 @xl:row-start-2 @xl:justify-between @xl:px-[3.2cqw] @xl:pb-[10svh] @xl:pt-[3svh]",
  posts: "grid grid-cols-1 gap-12 px-5 pb-16 pt-10 @xl:col-span-3 @xl:col-start-2 @xl:row-start-2 @xl:grid-cols-3 @xl:gap-0 @xl:p-0 @xl:pb-[10svh]",
};

export default function PanelJournal({ posts }: { posts: number[] }) {
  const { edit } = useTemplate();
  const allUrl = useField("allUrl").value;

  return (
    <PanelFrame kind="even" grid="@xl:grid-rows-[minmax(32svh,auto)_auto]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      <div className={place.title}>
        <PanelTitle field="title" />
      </div>

      <div className={place.accent}>
        <AccentNumber />
      </div>

      <div className={place.side}>
        <Rise>
          <p className={`m-0 max-w-[16rem] ${type.muted}`}>
            <FieldValue field="intro" />
          </p>
        </Rise>
        <Rise delay={0.1}>
          <a href={edit ? undefined : allUrl || undefined} target="_blank" rel="noreferrer" className={arrowLink}>
            <FieldValue field="allLabel" />
            <ArrowRight aria-hidden="true" className={arrowIcon} strokeWidth={1.5} />
          </a>
        </Rise>
      </div>

      <div className={place.posts}>
        {posts.map((n, i) => (
          <Post key={n} n={n} delay={i * 0.15} />
        ))}
      </div>
    </PanelFrame>
  );
}

function Post({ n, delay }: { n: number; delay: number }) {
  const { edit } = useTemplate();
  const url = useField(`post${n}Url`).value;
  const title = useField(`post${n}Title`).value;
  return (
    <article className="group/post relative flex flex-col @xl:px-[1.6cqw] @xl:pt-[3svh]">
      <Sweep delay={delay} className="aspect-[4/5] bg-foreground/[0.07]">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/post:scale-[1.06]">
          <FieldPicture field={`post${n}Image`} alt={title} className="absolute inset-0 block h-full w-full object-cover" />
        </div>
      </Sweep>
      <Rise delay={delay + 0.3} className="flex flex-col gap-3 pt-5">
        <span className="flex gap-3 text-[12px] uppercase tracking-[0.08em]">
          <span className="text-primary">
            <FieldValue field={`post${n}Category`} />
          </span>
          <span className="text-muted-foreground">
            <FieldValue field={`post${n}Date`} />
          </span>
        </span>
        <h3 className={`m-0 ${type.name}`}>
          {/* The whole card follows the story's link; while editing, plain text. */}
          <a href={edit ? undefined : url || undefined} target="_blank" rel="noreferrer" className="text-foreground no-underline after:absolute after:inset-0">
            <FieldValue field={`post${n}Title`} />
          </a>
        </h3>
        <p className={`m-0 ${type.muted}`}>
          <FieldValue field={`post${n}Excerpt`} />
        </p>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em]">
          <FieldValue field="readLabel" />
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/post:-translate-y-0.5 group-hover/post:translate-x-0.5" strokeWidth={1.5} />
        </span>
      </Rise>
    </article>
  );
}
