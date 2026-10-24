import DemoControls from "@/components/site-templates/DemoControls";
import MinimalPreview from "@/components/templates/MinimalPreview";
import { demoPortfolioData } from "@/components/templates/demo-data";

// Where Minimal's demo lives, and Minimal's demo itself: the template with its
// demo content and the same floating controls as every other template's.
export const MINIMAL_DEMO_HREF = "/templates/demo/minimal";

export default function MinimalDemo() {
  return (
    <>
      <MinimalPreview data={demoPortfolioData} />
      <DemoControls editorHref="/templates/editor/minimal" />
    </>
  );
}
