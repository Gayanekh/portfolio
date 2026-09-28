import Image from "next/image";

export default function BrandMark() {
  return (
    <Image
      src="/images/brand/portory-logo.svg"
      alt="Portory"
      width={1536}
      height={768}
      className="h-8 w-[184px] max-w-full rounded-md object-cover object-center"
      priority
    />
  );
}

