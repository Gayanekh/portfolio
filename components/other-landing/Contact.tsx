import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/components/other-landing/content";
import { colors, focusRing, type } from "@/components/other-landing/ui";

// The reference's Get in touch: a grey band across the page with one large
// link and two lines, then the copyright and the links at its foot.
export default function Contact() {
  return (
    <footer className={`${colors.card} px-[clamp(1rem,2vw,1.875rem)] pb-[clamp(1.5rem,2vw,2.25rem)] pt-[clamp(2rem,3vw,2.5rem)]`}>
      <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-[clamp(4rem,10vw,8.5rem)]">
        <div>
          <Link href={CONTACT.href} className={`${focusRing} group inline-flex items-center gap-4 rounded-[4px] text-[#090909] no-underline`}>
            <span className={type.heading}>{CONTACT.title}</span>
            <ArrowRight aria-hidden="true" className="size-[clamp(1.5rem,2vw,2rem)] transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <p className={`mb-0 mt-[clamp(1rem,1.6vw,1.5rem)] ${type.body} ${colors.body}`}>
            {CONTACT.text.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className={`m-0 ${type.small} ${colors.quiet}`}>{CONTACT.copyright}</p>
          <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2 p-0">
            {CONTACT.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`${focusRing} rounded-[4px] ${type.small} uppercase text-[#090909] no-underline transition-colors hover:text-[#777]`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
