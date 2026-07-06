# Savr — marketing site

The public website for **Savr**, the app that saves recipes from any link and keeps
them (with macros) on your phone for offline cooking.

Built as a static site so it can be hosted for free on **GitHub Pages**. It mirrors
the app's **Savr Design System** — paprika brand, basil/honey accents, warm "sand"
neutrals and warm "ink" text, with Bricolage Grotesque / Inter / Space Grotesk type.

## Pages

| File | Contents |
|------|----------|
| `index.html` | Hero, "how it works", **feature showcase**, spotlight sections, **contact form**, CTA |
| `privacy.html` | Full **privacy policy** |

Design tokens live in `assets/css/styles.css`; behaviour (theme toggle, scroll
reveal, contact form) in `assets/js/main.js`.

## Deploy to GitHub Pages

1. Create a repo (e.g. `savr-site`) and push these files to it:
   ```bash
   git init
   git add .
   git commit -m "Savr marketing site"
   git branch -M main
   git remote add origin git@github.com:<you>/savr-site.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**, set **Source = Deploy
   from a branch**, branch **`main`**, folder **`/ (root)`**, then **Save**.
3. Your site goes live at `https://<you>.github.io/savr-site/` within a minute or two.

The `.nojekyll` file tells Pages to serve the files as-is (no Jekyll processing).

### Custom domain (optional)
Add a `CNAME` file containing your domain (e.g. `savrapp.com`) and point your DNS at
GitHub Pages per [GitHub's docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Wire up the contact form

The form works out of the box by **opening the visitor's email app pre-filled** —
no backend required. To collect submissions to your inbox instead:

1. Create a free form at [Formspree](https://formspree.io) (or similar).
2. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` with your endpoint.

`assets/js/main.js` detects the configured endpoint and submits via `fetch`, showing
an inline success/error message. Until it's configured, it falls back to the
`mailto:` draft. Update the fallback address (`hello@savrapp.com`) in both
`index.html`/`privacy.html` and `main.js` to your real support email.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Assets

Logo, app icon and screenshot were copied from the Savr app repo
(`../Savr`). Replace the placeholder store screenshot / email address with your own
before launch.
