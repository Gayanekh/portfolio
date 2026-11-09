import type { Metadata } from "next";
import { Works } from "@/components/gayane/sections";

export const metadata: Metadata = { title: "Work" };

export default function GayaneWorkPage() {
  return (
    <div className="pt-[clamp(4rem,8vw,6rem)]">
      <Works title="My work" more={false} />
    </div>
  );
}
