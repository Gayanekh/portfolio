import { redirect } from "next/navigation";
import { MINIMAL_DEMO_HREF } from "@/components/templates/MinimalDemo";

// Minimal's demo moved beside the other templates' demos.
export default function MinimalDemoPage() {
  redirect(MINIMAL_DEMO_HREF);
}
