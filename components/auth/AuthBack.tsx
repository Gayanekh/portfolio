"use client";

import BackToHome from "@/components/BackToHome";
import { useLastPage } from "@/components/navigation/LastPage";

// The sign-in pages' Back button: back to the page the visitor was on before
// signing in, or home when they opened the page directly.
export default function AuthBack() {
  return <BackToHome href={useLastPage() ?? "/"} label="Back" />;
}
