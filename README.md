# ポートフォリオサイト

Web制作・業務改善の業務委託案件に応募するための、1ページのポートフォリオです。
検索エンジンには載せない設定（`noindex`）で、URLを知っている人だけが見る想定です。

- 公開URL：https://ichiry-matsushita.github.io/portfolio-2026/ （`main` に push すると GitHub Pages に自動で公開）
- 制作：Claude Code を使ったAIコーディング。ステップごとの作業時間は [WORKLOG.md](WORKLOG.md) に記録

## 守秘義務のルール

過去・現在の勤務先の社名、担当したサイト名、URL、スクリーンショットは載せません。
文章を直すときも、このルールを最優先にしてください。

## 技術構成

| 項目 | 内容 |
|---|---|
| 静的サイトジェネレーター | Eleventy 3 |
| テンプレート | Nunjucks |
| スタイル | SCSS（ビルド時に `sass` で変換し、`<style>` としてHTMLに埋め込む） |
| フォント | Google Fonts（Noto Sans JP / Inter）。ビルド時にページで使っている文字だけを `text=` で指定し、読み込みを軽くしている |
| JavaScript | なし（ページ内のスムーズスクロールは CSS の `scroll-behavior`） |
| 公開 | GitHub Pages（GitHub Actions で自動デプロイ） |

## 使い方

Node.js 24 で動作を確認しています。

```bash
npm install
npm start        # 開発サーバー http://localhost:8090/（SCSS の変更も自動で反映）
npm run build    # 公開用のファイルを _site/ に書き出す
npm run images   # images-src/ の画像を公開用に変換（メタデータは削除）
```

Windows では、Eleventy の開発サーバーが新しく追加したファイルを拾わないことがあります。ファイルを追加したら `npm start` をやり直してください。

## 文章の直し方

文章はすべて `src/_data/` の JSON ファイルにあります。テンプレートを触らずに直せます。

| ファイル | 中身 |
|---|---|
| `site.json` | 名前、ページのタイトル、説明文、メニュー |
| `hero.json` | ファーストビュー（英字ラベル、見出し、説明文、数字の3枠、ボタン） |
| `cases.json` | 事例（番号、補足、見出し、ビフォー・アフターの数字、3つの枠、タグ、リンク） |
| `samples.json` | サンプル制作物と「このサイトについて」 |
| `skills.json` | スキル |
| `workStyle.json` | 働き方・ご依頼条件 |
| `contact.json` | お問い合わせ（メールアドレス。`fukugyoUrl` に複業クラウドのURLを入れると「複業クラウドで相談する」ボタンが出る） |

`[YOUR NAME]` や `[○]` など、角かっこの部分は後で差し替える箇所です。

```bash
grep -rn "\[" src/_data/
```

## 画像

- `images-src/`：元の画像。`sample-ouchi-italian.png` はサンプルのスクリーンショット（1200×750）、`ogp.png` はOGP画像（1200×630）
- `images-src/ogp.html`：OGP画像の元。ブラウザで 1200×630 の大きさで開いて撮影する
- `npm run images` で `src/assets/img/` に公開用の画像を書き出す。撮影日時や位置情報などのメタデータはこのときに消える

2枚目のサンプルの画像を追加するときは、`images-src/` に置き、`scripts/optimize-images.js` の `jobs` に1行足して、`samples.json` の `image` にパスを書きます。

## フォルダ構成

```
src/
  index.njk              ページの並び順
  _data/*.json           文章
  _includes/base.njk     <head>（noindex、OGP、フォント）
  _includes/sections/    セクションごとのテンプレート
  scss/
    _tokens.scss         デザイントークン（色・文字・角丸・余白）
    _base.scss           土台
    _components.scss     共通部品（ボタン、カード、タグ、セクション見出し）
    _sections.scss       各セクション
  assets/                画像・favicon（そのままコピー）
images-src/              画像の元
scripts/                 画像の変換
.github/workflows/       GitHub Pages への自動デプロイ
```

## 品質のチェック（2026年11月18日時点）

| 項目 | 結果 |
|---|---|
| 見出しの階層 | h1 → h2 → h3 → h4 |
| ボタン・リンク | すべて `<a>` |
| コントラスト | 最も低い組み合わせで 5.08:1 |
| 画像 | 代替テキストあり、メタデータ削除済み |
| タイトル・説明文・OGP | 設定済み（OGP画像は公開URLの絶対パス） |
| Lighthouse（公開ページ、スマホ / PC） | パフォーマンス 92〜99 / 100、アクセシビリティ 100 / 100、ベストプラクティス 100 / 100 |

SEO は `noindex` を入れているため 63 点ですが、意図どおりです。
