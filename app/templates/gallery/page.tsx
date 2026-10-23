import { redirect } from "next/navigation";

// The gallery's address now leads to the templates page.
export default function TemplateGalleryPage() {
  redirect("/templates");
}
