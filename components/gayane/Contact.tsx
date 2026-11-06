"use client";

import { useState, type FormEvent } from "react";
import { CONTACT, PERSON } from "@/components/gayane/content";
import { ContactLinks, Fade, FlowHalf, halves, link, StillHalf, type, Words } from "@/components/gayane/ui";
import { focusRing } from "@/components/template-landing/ui";

const FIELDS = [
  { name: "name", label: "Name", input: "text", autoComplete: "name", placeholder: "Your name", required: true },
  { name: "email", label: "Email", input: "email", autoComplete: "email", placeholder: "you@company.com", required: true },
  { name: "phone", label: "Phone", input: "tel", autoComplete: "tel", placeholder: "+1 (000) 000-0000", required: false },
];
const label = `flex flex-col gap-2 font-medium ${type.small}`;
const field = `${focusRing} w-full rounded-none border-0 border-b border-solid border-[var(--line)] bg-transparent px-0 pb-2 text-[1rem] font-normal tracking-[-0.01em] text-[var(--fg)] transition-colors duration-200 placeholder:text-[var(--dim)] focus:border-[var(--fg)]`;

// Contact: the title and the ways to reach Gayane hold still on one side of the line,
// the form sits on the other. There is no mail service behind the site, so sending
// opens the visitor's own email app with the message written out.
export default function Contact() {
  const [sent, setSent] = useState(false);
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = data.get("phone");
    const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}${phone ? `\n${phone}` : ""}`;
    window.location.href = `mailto:${PERSON.email}?subject=${encodeURIComponent(`Portfolio message from ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <div className={halves}>
      <StillHalf className="!pb-6">
        <div>
          <h1 className={type.title}>
            <Words text={CONTACT.title} step={0.04} />
          </h1>
          <Fade delay={0.3}>
            <p className={`m-0 mt-5 max-w-[26rem] text-[var(--dim)] ${type.body}`}>{CONTACT.text}</p>
          </Fade>
        </div>
        <Fade delay={0.4}>
          <ContactLinks />
        </Fade>
      </StillHalf>
      <FlowHalf>
        <Fade delay={0.4}>
          <form onSubmit={send} className="flex flex-col gap-6">
            {FIELDS.map((item) => (
              <label key={item.name} className={label}>
                <span>
                  {item.label}
                  {item.required && <span aria-hidden="true" className="text-[var(--accent)]">*</span>}
                </span>
                <input name={item.name} type={item.input} autoComplete={item.autoComplete} placeholder={item.placeholder} required={item.required} className={field} />
              </label>
            ))}
            <label className={label}>
              <span>
                Message<span aria-hidden="true" className="text-[var(--accent)]">*</span>
              </span>
              <textarea name="message" rows={5} placeholder="What would you like to talk about?" required className={`${field} resize-y`} />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <button type="submit" className={`${link} cursor-pointer border-0 bg-transparent p-0 text-[1rem] font-medium tracking-[-0.02em]`}>
                Send Message
              </button>
              <p aria-live="polite" className={`m-0 text-[var(--dim)] ${type.small}`}>
                {sent ? `Nothing opened? Write to ${PERSON.email}.` : "This opens your email app."}
              </p>
            </div>
          </form>
        </Fade>
      </FlowHalf>
    </div>
  );
}
