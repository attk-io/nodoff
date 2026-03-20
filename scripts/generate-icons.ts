import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const svg = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="128" height="128" rx="21" fill="#4F46E5"/>
<path d="M28 94L28 86L68 86L28 54L28 46L72 46L72 54L36 54L72 86L72 94Z" fill="white"/>
<path d="M60 40L60 34L90 34L60 10L60 4L94 4L94 10L67 10L94 34L94 40Z" fill="white" opacity="0.75"/>
<path d="M82 52L82 47.5L102 47.5L82 30L82 24.5L105 24.5L105 30L87 30L105 47.5L105 52Z" fill="white" opacity="0.5"/>
</svg>`;

const sizes = [16, 32, 48, 128];
const publicDir = join(import.meta.dir, "../public");

for (const size of sizes) {
  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

  writeFileSync(join(publicDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
}
