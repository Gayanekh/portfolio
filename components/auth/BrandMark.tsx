import Image from "next/image";

export default function BrandMark() {
  return (
    <Image
      src="/images/brand/portory-wordmark.png"
      alt="Portory"
      width={1064}
      height={276}
      className="h-8 w-auto max-w-full"
      priority
    />
  );
}
