import { readFile } from "node:fs/promises";
import path from "node:path";

// The screenshots of a template's project page (public/images/gayane/<slug>/): the page on a desktop and a phone
// together, each alone, and the whole page. Read on the server, with their real sizes (next/image needs them, so
// nothing shifts as they load); a picture that is not there is simply left out, so a template without them shows
// no screens section.
export const SHOT_NAMES = ["desktop-mobile", "desktop", "mobile", "full-page"] as const;
export type ShotName = (typeof SHOT_NAMES)[number];
export type Shot = { src: string; width: number; height: number };
export type Shots = Partial<Record<ShotName, Shot>>;

// The size of a WebP file, from its header (a lossy, lossless or extended one).
function webpSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  const kind = buffer.toString("ascii", 12, 16);
  if (kind === "VP8 ") return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  if (kind === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (kind === "VP8X") return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
  return null;
}

export async function loadShots(slug: string): Promise<Shots> {
  const shots: Shots = {};
  for (const name of SHOT_NAMES) {
    try {
      const size = webpSize(await readFile(path.join(process.cwd(), "public", "images", "gayane", slug, `${name}.webp`)));
      if (size) shots[name] = { src: `/images/gayane/${slug}/${name}.webp`, ...size };
    } catch {
      // not there: left out
    }
  }
  return shots;
}
