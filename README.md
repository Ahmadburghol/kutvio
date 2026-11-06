# Kutvio website

Static marketing site for **Kutvio** at **https://kutvio.com**. It's plain HTML, CSS and vanilla JS: no framework, no npm, no build step, and no third-party requests (fonts are self-hosted, and there are no analytics or tracking).

## Site values (find & replace these)

| Key | Value |
|---|---|
| App name | Kutvio |
| Company | Clixasoft — Amman, Jordan |
| Site URL | https://kutvio.com |
| Support email | support@kutvio.com |
| Privacy email | privacy@kutvio.com |
| App Store URL | *(not yet — shows "Coming soon")* |
| Google Play URL | *(not yet — shows "Coming soon")* |
| Instagram | https://instagram.com/kutvio |
| TikTok | https://tiktok.com/@kutvio |
| Legal pages last updated | 2026-11-06 |

> ⚠️ kutvio.com had **no MX records** on 2026-11-06, so mail to support@ and privacy@ will bounce until email is set up for the domain. Both stores require a working contact.

## Preview locally

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000/  (Arabic: http://localhost:8000/ar/)
```

`404.html` is only served automatically by GitHub Pages. Locally, open `http://localhost:8000/404.html` directly.

## Structure

```
website/
  index.html features.html download.html faq.html support.html privacy.html terms.html
  404.html                 # bilingual; uses root-absolute paths (/assets/...) on purpose
  ar/                      # Arabic pages, same file names, dir="rtl"
  assets/css/style.css     # one stylesheet for both languages (logical properties)
  assets/js/main.js        # mobile menu, language memory, footer year, fade-in
  assets/fonts/            # Inter (latin, latin-ext) + Cairo (arabic) woff2, OFL licenses
  assets/img/              # logo, favicons, og-image.png, screens/, qr/, badges/
  CNAME  .nojekyll  robots.txt  sitemap.xml
```

- **The site works without JavaScript.** Navigation becomes a horizontally scrollable row on phones, and the FAQ uses native `<details>`.
- **First-visit language redirect** (English home page only, inline script in `<head>`): if nothing is saved and `navigator.language` starts with `ar`, the visitor goes to `ar/index.html`. Clicking a language switcher saves the choice in `localStorage` (`kutvio_lang`), and the redirect never runs again.
- **Screenshots** in `assets/img/screens/` are real captures of the app from the iOS simulator. They are WebP with PNG fallback, 590×1280 for phone and 900×1200 for tablet. To replace one, keep the file name and size, and regenerate the WebP with `cwebp -q 80 name.png -o name.webp`.

## Maintenance checklist

The header and footer are **duplicated in every page** (better for SEO and for visitors without JS). When you change navigation, links, social URLs or the copyright line, update **all 15 files**:

- [ ] `index.html features.html download.html faq.html support.html privacy.html terms.html`
- [ ] `ar/` — the same 7 files
- [ ] `404.html` (links only)
- [ ] Keep each page's language switcher pointing to the same page in the other language
- [ ] `sitemap.xml` if you add or rename a page; also add `hreflang` links to the new page's `<head>`
- [ ] Legal changes: update the text **and** the "Last updated" date in both languages, plus `<lastmod>` in `sitemap.xml`

## Going live with the store badges

Badges render as `<span class="badge is-soon">` with "Coming soon" (or «قريبًا» on Arabic pages). Once a store link exists, update every occurrence (home hero, home CTA, features CTA, download page) in both languages:

```html
<!-- before -->
<span class="badge is-soon" aria-label="App Store — Coming soon"> … <small>Coming soon</small><strong>App Store</strong></span>
<!-- after -->
<a class="badge" href="https://apps.apple.com/app/idXXXXXXXXX"> … <small>Download on the</small><strong>App Store</strong></a>
```

For Arabic pages use «حمّله من» (App Store) and «احصل عليه من» (Google Play). If you'd rather use the official artwork, download it from Apple (https://developer.apple.com/app-store/marketing/guidelines/) and Google (https://play.google.com/intl/en_us/badges/), put it in `assets/img/badges/`, and follow each brand's usage rules.

Replace the QR placeholders in `assets/img/qr/` with real QR codes for the store URLs, keeping the same file names. You can generate them offline, e.g. `qrencode -t SVG -o app-store.svg "https://apps.apple.com/…"`.

Also update `download.html` / `ar/download.html` (the "Launching soon" lead and the store cards) and the hero note on both home pages.

## URLs for the store consoles

**App Store Connect**
- Privacy Policy URL: `https://kutvio.com/privacy.html`
- Support URL: `https://kutvio.com/support.html`
- Marketing URL: `https://kutvio.com/`

**Google Play Console**
- Privacy policy: `https://kutvio.com/privacy.html`

(The app's Settings → About links to `https://kutvio.com/privacy`. GitHub Pages serves `privacy.html` for that extensionless URL, so both forms work.)

## Deployment

The workflow is `.github/workflows/deploy-website.yml` at the repo root. It is the only file outside `website/`.

### Option B (default): app repo stays private, free GitHub plan

Free GitHub Pages only works from public repos, so the workflow copies `website/` into a separate **public** repo that hosts Pages.

1. Create an empty **public** GitHub repo, e.g. `kutvio-website`.
2. In `.github/workflows/deploy-website.yml`, replace `YOUR_GITHUB_USERNAME` with your GitHub user or organization.
3. Generate a deploy key pair:
   ```bash
   ssh-keygen -t ed25519 -C "kutvio-website-deploy" -f deploy_key -N ""
   ```
4. In `kutvio-website` → Settings → Deploy keys, add `deploy_key.pub` with **Allow write access**.
5. In the app repo → Settings → Secrets and variables → Actions, add the private key `deploy_key` as **`WEBSITE_DEPLOY_KEY`**. Then delete both local key files.
6. Push a change under `website/` to `main`, or run the workflow manually from the Actions tab.
7. In `kutvio-website` → Settings → Pages: Source = **Deploy from a branch**, branch `main`, folder `/ (root)`, custom domain `kutvio.com`.

### Option A: app repo is public, or the account has a paid plan

Replace the workflow with:

```yaml
name: Deploy website
on:
  push:
    branches: [main]
    paths: ['website/**']
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v7
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: website
      - id: deployment
        uses: actions/deploy-pages@v5
```

Then go to repo **Settings → Pages → Source: GitHub Actions** and set the custom domain `kutvio.com`.

### Note: this repo is currently hosted on GitLab

The app repo's remote is `gitlab.com/burghol/kutvio-app`, and GitHub Actions only runs on GitHub. To use the workflow as written, mirror or move the repo to GitHub. Alternatively, GitLab Pages can host the site straight from this repo, even if the project is private: Pages visibility can be set to public. That needs a `.gitlab-ci.yml` with a `pages` job that publishes `website/` as the artifact (use `publish: website` or copy it to `public/`), plus the custom domain under Deploy → Pages. The DNS records below would then differ (GitLab shows them when you add the domain).

### DNS (at the domain registrar, for GitHub Pages)

- 4 × **A** records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Optional 4 × **AAAA** for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- **CNAME** `www` → `YOUR_GITHUB_USERNAME.github.io`
- After DNS resolves, tick **Enforce HTTPS** in the Pages settings. We also recommend verifying `kutvio.com` in GitHub account Settings → Pages, which prevents domain takeover.

> kutvio.com currently has A records pointing elsewhere (`15.197.148.33`, `3.33.130.190`, likely registrar parking). Replace them with the records above.

## Licenses

- Inter and Cairo fonts: SIL Open Font License 1.1 (`assets/fonts/*-OFL.txt`).
- Logo, icons, illustrations and screenshots: © Clixasoft. Icons are hand-drawn inline SVG; no third-party icon sets are used.
