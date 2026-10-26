import type { Metadata } from "next";
import { Contact } from "../_site/sections";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <Contact />;
}
