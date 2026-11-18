import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // GitHub Pages のサブパス（/リポジトリ名/）に合わせてリンクを書き換える
  eleventyConfig.addPlugin(HtmlBasePlugin);
  // sass が書き出したCSSの変更でもブラウザを再読み込みする
  eleventyConfig.setServerOptions({ watch: ["_site/css/**/*.css"] });

  // 公開URL（例：https://<ユーザー名>.github.io/<リポジトリ名>）。OGPは絶対URLが必要なため。
  // GitHub Actions で SITE_URL を渡す。ローカルでは空のまま。
  eleventyConfig.addGlobalData("siteUrl", (process.env.SITE_URL || "").replace(/\/$/, ""));

  // 画像・JavaScript はそのままコピー
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    // 例：PATH_PREFIX=/portfolio-site/
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
