import { TEMPLATE_IMAGE, type PersonKey, type TemplateId } from "@/components/landing/sample-portfolios";

// Shows a template's mock portfolio photo, cropped to fill the frame it sits
// in. Decorative. `person` and `base` are kept so the places that use it stay
// unchanged; they will matter again once the real templates replace the photos.
export default function ScaledPreview({
  template,
  className = "absolute inset-0",
}: {
  template: TemplateId;
  person: PersonKey;
  base: 390 | 1100;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden bg-foreground/5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote mock photo */}
      <img src={TEMPLATE_IMAGE[template]} alt="" aria-hidden="true" decoding="async" className="block h-full w-full object-cover" />
    </div>
  );
}
