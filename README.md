# SPWOA

Single Page Website with OpenAI Codex.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Ensure your default branch is `main` (or update `.github/workflows/deploy-pages.yml`).
3. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab).
5. Your site will be available at:
   - `https://<username>.github.io/<repository>/`
