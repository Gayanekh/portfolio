import { redirect } from "next/navigation";

// The portfolio is one page now (the Nocturne template); earlier links land on it.
export default function GayaneSubPage() {
  redirect("/gayane-khachatryan");
}
