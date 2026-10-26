import { defineTemplate } from "../core/types";
import SiteFooter, { siteFooterDefaults } from "../sections/SiteFooter";
import { siteHeaderDefaults } from "../sections/SiteHeader";
import { CartProvider } from "./cart";
import { About, Contact, Details, Header, Journal, Shop } from "./sections";

// TEST TEMPLATE — a single product page, built on the site template kit.
// Its look: Playfair Display for headings until a font pack is picked.
export const productTemplate = defineTemplate({
  id: "product",
  name: "Product",
  description:
    "A single product page with a large serif title, price, quantity and add-to-cart, and an ingredients section. Pick a palette and a font pack below.",
  siteTitle: { section: "header", field: "siteTitle" },
  theme: "[--font-display:var(--tf-playfair)]",
  Provider: CartProvider,
  inProgress: {
    note: "The shop is for show: it looks and counts like a real one, but nothing can be bought yet.",
    notWorking: ["Add to cart and the cart (no checkout or payments yet)", "The Login link in the header", "The Instagram link in the header"],
  },
  sections: [
    { id: "header", label: "Header", Component: Header, defaults: siteHeaderDefaults },
    {
      id: "product",
      label: "Shop",
      menu: "Shop",
      Component: Shop,
      defaults: {
        title: "Cypress and Tea Tree",
        price: "$12.00",
        description: "It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more.",
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "price", label: "Price" },
        { name: "description", label: "Description", multiline: true },
      ],
    },
    {
      id: "details",
      label: "Ingredients",
      Component: Details,
      defaults: {
        title: "Cypress and Tea Tree",
        label: "Full Ingredients",
        ingredients: "Saponified olive, coconut and sunflower oils, shea butter, cypress essential oil, tea tree essential oil, kaolin clay, rosemary extract.",
      },
    },
    {
      id: "journal",
      label: "Journal",
      menu: "Journal",
      Component: Journal,
      defaults: {
        title: "Journal",
        post1Date: "March 4",
        post1Title: "Notes from the cypress groves",
        post1Excerpt: "Where our essential oils come from, and the small farms that distil them by hand.",
        post2Date: "February 18",
        post2Title: "How a bar of soap is cured",
        post2Excerpt: "Six weeks on wooden racks: why we wait, and what the time does for every bar.",
        post3Date: "January 29",
        post3Title: "A slower morning ritual",
        post3Excerpt: "Five quiet minutes, warm water and a good bar of soap. A small case for slowing down.",
      },
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        title: "About",
        text: "We make small batches of cold-process soap in a sunny studio by the sea, with plant oils, clays and essential oils, and nothing else.",
        note: "Every bar is cut, stamped and wrapped by hand.",
      },
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        title: "Contact",
        text: "Questions about an order, wholesale or a custom batch? Write to us and we'll reply within two days.",
        email: "hello@yoursite.com",
      },
      fields: [{ name: "email", label: "Email" }],
    },
    { id: "footer", label: "Footer", Component: SiteFooter, defaults: siteFooterDefaults },
  ],
});
