import { HtmlBasePlugin } from "@11ty/eleventy";
import * as sass from "sass";

export default function (eleventyConfig) {
  // GitHub Pages のサブパス（/リポジトリ名/）に合わせてリンクを書き換える
  eleventyConfig.addPlugin(HtmlBasePlugin);
  // CSS は約9KBと小さいので、別ファイルにせず <style> に埋め込む（表示を待たせないため）
  eleventyConfig.addWatchTarget("src/scss/");
  eleventyConfig.addShortcode("inlineCss", () =>
    // charset: false … 日本語のコメントがあると先頭に BOM が付き、<style> の最初のルールが無効になるため
    sass.compile("src/scss/main.scss", { style: "compressed", charset: false }).css
  );

  // 公開URL（例：https://<ユーザー名>.github.io/<リポジトリ名>）。OGPは絶対URLが必要なため。
  // GitHub Actions で SITE_URL を渡す。ローカルでは空のまま。
  eleventyConfig.addGlobalData("siteUrl", (process.env.SITE_URL || "").replace(/\/$/, ""));

  // Google Fonts には、このページで使っている文字だけを頼む（text= パラメーター）。
  // 日本語フォントは全部読むと CSS だけで約90KBになり、スマホで表示が遅れるため。
  // テンプレートの href に入れた __FONT_TEXT__ を、ビルド時にページの文字で置き換える。
  eleventyConfig.addTransform("fontSubset", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html") || !content.includes("__FONT_TEXT__")) return content;
    const text = content
      .replace(/<head[\s\S]*?<\/head>/, " ")
      .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&copy;/g, "©")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    // 英数字と記号はいつでも使えるように、ASCII の印字できる文字をすべて含める
    let ascii = "";
    for (let c = 0x20; c < 0x7f; c++) ascii += String.fromCharCode(c);
    const chars = [...new Set([...ascii, ...text.replace(/\s/g, ""), "→", "↓", "©", "〜", "／", "・"])].sort().join("");
    return content.replace("__FONT_TEXT__", encodeURIComponent(chars));
  });

  // 画像・JavaScript はそのままコピー
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    // 例：PATH_PREFIX=/portfolio-site/
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
