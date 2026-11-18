// images-src/ の PNG を、公開用の画像に変換して src/assets/img/ に書き出す。
// sharp は既定でメタデータ（撮影日時・位置情報など）を書き出さないので、元画像の情報は残らない。
//   npm run images
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "src/assets/img";

const jobs = [
  // サンプル：おうちイタリアン手帖のトップページ（1200×750 で撮影）
  { src: "images-src/sample-ouchi-italian.png", out: "sample-ouchi-italian.webp", width: 800, format: "webp" },
  // OGP画像：SNSで共有されたときに出る画像。対応の幅が広い PNG にする
  { src: "images-src/ogp.png", out: "ogp.png", width: 1200, format: "png" },
];

await mkdir(OUT, { recursive: true });
for (const job of jobs) {
  const img = sharp(job.src).resize({ width: job.width });
  const info = await (job.format === "webp" ? img.webp({ quality: 80 }) : img.png({ compressionLevel: 9, palette: true }))
    .toFile(`${OUT}/${job.out}`);
  console.log(`${job.out}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)}KB`);
}
