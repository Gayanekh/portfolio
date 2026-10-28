"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useField, useTemplate } from "../../core/context";
import { button, FieldValue, Frame, gutter, Label, Rise, Roll, space, Title, type, Window } from "./kit";

// The invitation to get in touch: a huge headline with a highlighted word,
// a line about what to send, a button writing an email and one copying the
// address, and the person's other places; beside it a picture in a window
// with a note pinned in its corner.
//
// Its section's fields: `label`, `title`, `text`, `email`, `cta`, `copy`,
// `copied`, `image`, `note`, and for each link (`social1`...): Label and Url.

export default function ShowcaseContact({ socials }: { socials: number[] }) {
  const { edit } = useTemplate();
  const email = useField("email").value;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // No clipboard (an insecure page): the address is still on the button.
    }
  };

  return (
    <Frame>
      <div className={`grid gap-14 @3xl:grid-cols-[1.3fr_0.7fr] @3xl:items-end @3xl:gap-[5cqw] ${space} ${gutter}`}>
        <div className="flex flex-col gap-10">
          <Label field="label" />
          <Title field="title" className={type.display} />
          <Rise delay={0.2} className="flex flex-col gap-10">
            <p className={`m-0 max-w-[30rem] ${type.body}`}>
              <FieldValue field="text" />
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={edit ? undefined : `mailto:${email}`} className={button.solid}>
                <Roll>
                  <FieldValue field="cta" />
                </Roll>
                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover/roll:rotate-45" />
              </a>
              <button type="button" onClick={edit ? undefined : copy} aria-live="polite" className={button.outline}>
                <Roll>{copied ? <FieldValue field="copied" /> : <FieldValue field="copy" />}</Roll>
                <span className="font-mono text-[12px] text-muted-foreground">
                  <FieldValue field="email" />
                </span>
              </button>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
              {socials.map((n) => (
                <li key={n}>
                  <Social n={n} />
                </li>
              ))}
            </ul>
          </Rise>
        </div>

        <Window field="image" className="aspect-[4/5]">
          <span className={`absolute bottom-4 left-4 rounded-[4px] bg-card px-3 py-2 text-foreground ${type.label}`}>
            <FieldValue field="note" />
          </span>
        </Window>
      </div>
    </Frame>
  );
}

function Social({ n }: { n: number }) {
  const { edit } = useTemplate();
  const url = useField(`social${n}Url`).value;
  return (
    <a href={edit ? undefined : url || undefined} target="_blank" rel="noreferrer" className={`group/roll flex items-center gap-1 text-foreground no-underline ${type.label}`}>
      <Roll>
        <FieldValue field={`social${n}Label`} />
      </Roll>
      <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-primary transition-transform duration-500 group-hover/roll:-translate-y-0.5 group-hover/roll:translate-x-0.5" />
    </a>
  );
}
