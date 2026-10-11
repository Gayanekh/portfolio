"use client";

import { useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

// TEST TEMPLATE — a product page ported from product-page.html to try the
// template gallery, detail page and editor. Safe to delete together with its
// entries in template-registry.tsx and gallery-templates.ts, and the
// /templates/editor route. Colours come from the theme tokens, so the
// palettes and font packs apply.

export interface ProductContent {
  siteTitle: string;
  title: string;
  price: string;
  description: string;
  detailsTitle: string;
  ingredientsLabel: string;
  ingredients: string;
  journalTitle: string;
  post1Title: string;
  post1Excerpt: string;
  post2Title: string;
  post2Excerpt: string;
  post3Title: string;
  post3Excerpt: string;
  aboutTitle: string;
  aboutText: string;
  aboutNote: string;
  contactTitle: string;
  contactText: string;
  contactEmail: string;
  footer: string;
}

export type ProductTextKey = keyof ProductContent;
export type ProductSectionId = "header" | "product" | "details" | "journal" | "about" | "contact" | "footer";

// The page's sections, top to bottom. The ones with `menu` are in the
// header's navigation, and its links lead to them.
export const PRODUCT_SECTIONS: { id: ProductSectionId; label: string; menu?: string }[] = [
  { id: "header", label: "Header" },
  { id: "product", label: "Shop", menu: "Shop" },
  { id: "details", label: "Ingredients" },
  { id: "journal", label: "Journal", menu: "Journal" },
  { id: "about", label: "About", menu: "About" },
  { id: "contact", label: "Contact", menu: "Contact" },
  { id: "footer", label: "Footer" },
];

export const PRODUCT_CONTENT: ProductContent = {
  siteTitle: "Your Site Title",
  title: "Cypress and Tea Tree",
  price: "$12.00",
  description: "It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more.",
  detailsTitle: "Cypress and Tea Tree",
  ingredientsLabel: "Full Ingredients",
  ingredients: "Saponified olive, coconut and sunflower oils, shea butter, cypress essential oil, tea tree essential oil, kaolin clay, rosemary extract.",
  journalTitle: "Journal",
  post1Title: "Notes from the cypress groves",
  post1Excerpt: "Where our essential oils come from, and the small farms that distil them by hand.",
  post2Title: "How a bar of soap is cured",
  post2Excerpt: "Six weeks on wooden racks: why we wait, and what the time does for every bar.",
  post3Title: "A slower morning ritual",
  post3Excerpt: "Five quiet minutes, warm water and a good bar of soap. A small case for slowing down.",
  aboutTitle: "About",
  aboutText: "We make small batches of cold-process soap in a sunny studio by the sea, with plant oils, clays and essential oils, and nothing else.",
  aboutNote: "Every bar is cut, stamped and wrapped by hand.",
  contactTitle: "Contact",
  contactText: "Questions about an order, wholesale or a custom batch? Write to us and we'll reply within two days.",
  contactEmail: "hello@yoursite.com",
  footer: "© Your Site Title",
};

export const PRODUCT_PAGES = {
  navigation: ["Shop", "Journal", "About", "Contact"],
  notLinked: ["Home", "Shipping and Returns", "Stockists"],
};

const serif = "font-[family-name:var(--tf-playfair)] font-black tracking-[-0.02em]";

const emailLink = "mt-9 inline-block border-b border-foreground pb-1 text-xs uppercase tracking-[0.12em] text-foreground no-underline";

const POSTS: { title: ProductTextKey; excerpt: ProductTextKey; date: string; art: string }[] = [
  { title: "post1Title", excerpt: "post1Excerpt", date: "March 4", art: "bg-[linear-gradient(160deg,#cfd8c8,#5f7a5c)]" },
  { title: "post2Title", excerpt: "post2Excerpt", date: "February 18", art: "bg-[linear-gradient(160deg,#f0e2d0,#c9a684)]" },
  { title: "post3Title", excerpt: "post3Excerpt", date: "January 29", art: "bg-[linear-gradient(160deg,#e6dfd6,#9a8b7a)]" },
];

export interface ProductTemplateProps {
  content?: ProductContent;
  // Lay the page out for a phone regardless of the screen (the editor's
  // mobile view). Without it the layout follows the screen width.
  mobile?: boolean;
  // Hooks the editor uses to make text editable and sections selectable.
  renderText?: (key: ProductTextKey, value: string) => ReactNode;
  renderSection?: (id: ProductSectionId, children: ReactNode) => ReactNode;
  // Show only this section (the editor's section-by-section view).
  only?: ProductSectionId;
  // A menu link was clicked. Without it the page scrolls to that section.
  onNavigate?: (id: ProductSectionId) => void;
  // The menu item to underline. Without it, the last one clicked.
  activeSection?: ProductSectionId;
}

const plainText = (_key: ProductTextKey, value: string) => value;
const plainSection = (_id: ProductSectionId, children: ReactNode) => children;

export default function ProductTemplate({
  content = PRODUCT_CONTENT,
  mobile = false,
  renderText = plainText,
  renderSection = plainSection,
  only,
  onNavigate,
  activeSection,
}: ProductTemplateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<ProductSectionId>("product");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  // Desktop classes apply from md up, or never in the forced mobile view.
  const md = (classes: string) => (mobile ? "" : classes);
  const show = (id: ProductSectionId) => !only || only === id;
  // The editor is making the text editable, so the email is text, not a link.
  const editable = renderText !== plainText;

  const navigate = (event: MouseEvent, id: ProductSectionId) => {
    event.preventDefault();
    setCurrent(id);
    if (onNavigate) return onNavigate(id);
    rootRef.current?.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clamp = (n: number) => Math.min(99, Math.max(1, Number.isFinite(n) ? n : 1));
  const addToCart = (event: FormEvent) => {
    event.preventDefault();
    setCart((count) => count + qty);
    setToast(`Added ${qty} × ${content.title} to cart`);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div ref={rootRef} className="min-h-full bg-card text-foreground">
      {show("header") && renderSection(
        "header",
        <header data-section="header" className={`grid grid-cols-2 items-center gap-y-3.5 px-4 pb-2 pt-4 ${md("md:grid-cols-[1fr_auto_1fr] md:px-[30px] md:pt-8")}`}>
          <a href="#" aria-label="Instagram" className="text-foreground">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          <div className={`order-3 col-span-full ${md("md:order-none md:col-span-1")}`}>
            <div className={`${serif} text-center text-[length:clamp(32px,4vw,50px)] leading-none text-foreground`}>
              {renderText("siteTitle", content.siteTitle)}
            </div>
            <nav>
              <ul className={`m-0 flex list-none justify-center gap-[18px] p-0 pt-3.5 ${md("md:gap-11 md:pt-[18px]")}`}>
                {PRODUCT_SECTIONS.filter((section) => section.menu).map(({ id, menu }) => {
                  const active = (activeSection ?? current) === id;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={(event) => navigate(event, id)}
                        aria-current={active ? "location" : undefined}
                        className={`border-b pb-1 text-[11px] uppercase tracking-[0.12em] text-foreground no-underline transition-colors duration-300 ${active ? "border-foreground" : "border-transparent hover:border-foreground/40"}`}
                      >
                        {menu}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-3.5 justify-self-end text-[11px] uppercase tracking-[0.1em]">
            <a href="#" className="text-foreground no-underline">Login</a>
            <span className="flex items-center gap-1" aria-label={`Cart, ${cart} items`}>
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21.5 7H6.2" />
                <circle cx="10" cy="20" r="1.6" />
                <circle cx="17" cy="20" r="1.6" />
              </svg>
              <motion.span key={cart} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                {cart}
              </motion.span>
            </span>
          </div>
        </header>,
      )}

      <main>
        {show("product") && renderSection(
          "product",
          <section data-section="product" className={`grid grid-cols-1 items-start gap-[6vw] px-4 pb-20 pt-12 ${md("md:grid-cols-2 md:px-[30px] md:pt-[90px]")}`}>
            <div>
              <h1 className={`${serif} m-0 text-[length:clamp(44px,6vw,84px)] leading-[1.02]`}>{renderText("title", content.title)}</h1>
              <div className="mb-2.5 mt-[18px] text-xl">{renderText("price", content.price)}</div>
              <div className="max-w-[540px] text-[15px] leading-relaxed text-muted-foreground">{renderText("description", content.description)}</div>
              <form onSubmit={addToCart} className="mt-10 flex max-w-[540px] gap-2">
                <div className="flex h-[46px] items-center rounded-full border-[1.5px] border-foreground">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    onClick={() => setQty((n) => clamp(n - 1))}
                    className="h-full w-10 cursor-pointer border-0 bg-transparent text-lg text-foreground disabled:cursor-default disabled:opacity-30"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    aria-label="Quantity"
                    onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
                    className="w-8 border-0 bg-transparent text-center text-[13px] text-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((n) => clamp(n + 1))}
                    className="h-full w-10 cursor-pointer border-0 bg-transparent text-lg text-foreground"
                  >
                    +
                  </button>
                </div>
                <button
                  type="submit"
                  className="h-[46px] flex-1 cursor-pointer rounded-full border-[1.5px] border-foreground bg-transparent text-xs uppercase tracking-[0.12em] text-foreground transition-colors duration-200 hover:bg-foreground hover:text-card"
                >
                  Add to Cart
                </button>
              </form>
            </div>

            <div
              role="img"
              aria-label="Bar of soap beside a round mirror and dried grasses"
              className={`order-first aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(160deg,#ecd6c7,#dcbfa6)] ${md("md:order-none")}`}
            >
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
                <circle cx="250" cy="330" r="130" fill="none" stroke="#a8825f" strokeWidth="3" opacity=".55" />
                <circle cx="250" cy="330" r="128" fill="#d2a982" opacity=".25" />
                <rect x="120" y="300" width="95" height="150" rx="4" fill="#efdcc2" />
                <rect x="120" y="300" width="95" height="18" fill="#f6e8d4" />
                <path d="M60 500 C 70 470, 150 455, 260 470 L 300 500 Z" fill="#c9b49c" />
                <g stroke="#b59474" strokeWidth="2" fill="none">
                  <path d="M80 200 Q 220 330 360 480" />
                  <path d="M140 190 Q 200 300 250 400" />
                  <path d="M260 240 Q 240 330 230 420" />
                </g>
              </svg>
            </div>
          </section>,
        )}

        {show("details") && renderSection(
          "details",
          <section data-section="details" className={`grid grid-cols-1 items-start gap-[5vw] px-4 pb-[120px] pt-10 ${md("md:grid-cols-[1.1fr_1fr] md:px-[30px]")}`}>
            <div
              role="img"
              aria-label="Wind-shaped cypress trees on a sandy hillside"
              className="aspect-square bg-[linear-gradient(180deg,#d9dcd6_0%,#5f7a5c_45%,#2f4a33_70%,#c9b9a1_100%)]"
            >
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
                <ellipse cx="200" cy="150" rx="190" ry="90" fill="#2f5236" />
                <ellipse cx="260" cy="190" rx="110" ry="60" fill="#8a3a22" opacity=".85" />
                <ellipse cx="120" cy="120" rx="120" ry="55" fill="#3e6a44" />
                <path d="M190 220 C 185 270, 170 310, 140 360 M 210 220 C 220 280, 260 320, 330 360" stroke="#cfc7b8" strokeWidth="10" fill="none" strokeLinecap="round" />
                <rect x="0" y="330" width="400" height="70" fill="#d8c9b2" />
              </svg>
            </div>
            <div>
              <h2 className="m-0 mt-5 text-[34px] font-normal">{renderText("detailsTitle", content.detailsTitle)}</h2>
              <div className="mb-3 mt-10 text-[11px] font-medium uppercase tracking-[0.1em]">{renderText("ingredientsLabel", content.ingredientsLabel)}</div>
              <div className="text-sm leading-[1.7] text-muted-foreground">{renderText("ingredients", content.ingredients)}</div>
            </div>
          </section>,
        )}

        {show("journal") && renderSection(
          "journal",
          <section data-section="journal" className={`border-t border-foreground/15 px-4 pb-24 pt-16 ${md("md:px-[30px] md:pt-20")}`}>
            <h2 className={`${serif} m-0 text-[length:clamp(36px,4.5vw,60px)] leading-none`}>{renderText("journalTitle", content.journalTitle)}</h2>
            <div className={`mt-12 grid grid-cols-1 gap-12 ${md("md:grid-cols-3 md:gap-8")}`}>
              {POSTS.map((post) => (
                <article key={post.title}>
                  <div aria-hidden="true" className={`aspect-[4/3] ${post.art}`} />
                  <div className="mt-5 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{post.date}</div>
                  <h3 className="m-0 mt-2 text-xl font-normal leading-snug">{renderText(post.title, content[post.title])}</h3>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{renderText(post.excerpt, content[post.excerpt])}</div>
                </article>
              ))}
            </div>
          </section>,
        )}

        {show("about") && renderSection(
          "about",
          <section data-section="about" className={`grid grid-cols-1 gap-8 border-t border-foreground/15 px-4 py-20 ${md("md:grid-cols-[1fr_1.4fr] md:gap-[5vw] md:px-[30px] md:py-28")}`}>
            <h2 className={`${serif} m-0 text-[length:clamp(36px,4.5vw,60px)] leading-none`}>{renderText("aboutTitle", content.aboutTitle)}</h2>
            <div>
              <div className="max-w-[620px] text-[length:clamp(18px,2vw,24px)] leading-[1.5]">{renderText("aboutText", content.aboutText)}</div>
              <div className="mt-6 text-sm text-muted-foreground">{renderText("aboutNote", content.aboutNote)}</div>
            </div>
          </section>,
        )}

        {show("contact") && renderSection(
          "contact",
          <section data-section="contact" className={`border-t border-foreground/15 px-4 py-20 text-center ${md("md:px-[30px] md:py-28")}`}>
            <h2 className={`${serif} m-0 text-[length:clamp(36px,4.5vw,60px)] leading-none`}>{renderText("contactTitle", content.contactTitle)}</h2>
            <div className="mx-auto mt-6 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">{renderText("contactText", content.contactText)}</div>
            {editable ? (
              <span className={emailLink}>{renderText("contactEmail", content.contactEmail)}</span>
            ) : (
              <a href={`mailto:${content.contactEmail}`} className={emailLink}>
                {content.contactEmail}
              </a>
            )}
          </section>,
        )}
      </main>

      {show("footer") && renderSection(
        "footer",
        <footer data-section="footer" className="border-t border-foreground/15 p-[30px] text-xs text-muted-foreground">{renderText("footer", content.footer)}</footer>,
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-50 rounded-full bg-foreground px-5 py-3 text-[13px] text-card"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
