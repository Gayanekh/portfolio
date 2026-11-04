import Image from "next/image";
import { grade } from "@/components/other-landing/ui";

// A picture filling its (relative) box, in the page's grade.
export default function Picture({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} className={`${grade} ${className}`} />;
}
