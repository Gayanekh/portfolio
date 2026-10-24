import { redirect } from "next/navigation";

// The old template detail screen is no longer used: its address leads to the
// templates page. (Its frame, /templates/preview/<id>/frame, still draws the
// cards' live thumbnails.)
export default function TemplatePreviewPage() {
  redirect("/templates");
}
