# GitHub Pages Deployment Guide for Astro Site

## Current Status
❌ **The existing workflow will NOT deploy the Astro site correctly**
- Current workflow deploys root directory (vanilla HTML)
- Astro site is in `astro-site/` subdirectory
- Needs Node.js, npm install, and build step

## What Needs to Change

### 1. Update GitHub Actions Workflow
Replace `.github/workflows/deploy-pages.yml` with the Astro-specific workflow provided below.

### 2. No Additional GitHub Configuration Needed
✅ CNAME file already in place (tuhinmohanta.com)
✅ Custom domain already configured
✅ Repository permissions already set

### 3. GitHub Pages Settings
In your repository settings (Settings → Pages):
- **Source:** Deploy from a branch  
- **Branch:** `gh-pages` (will be created by the workflow)
- **Folder:** `/ (root)`

## New Workflow File

Replace `.github/workflows/deploy-pages.yml` with this content:

```yaml
name: Deploy Astro site to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'astro-site/package-lock.json'

      - name: Install dependencies
        run: |
          cd astro-site
          npm ci

      - name: Build Astro site
        run: |
          cd astro-site
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'astro-site/dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Deployment Steps

### Option A: Automatic Deployment (Recommended)

1. **Update the workflow file:**
   ```bash
   # Copy the new workflow content to .github/workflows/deploy-pages.yml
   ```

2. **Commit and push:**
   ```bash
   git add .github/workflows/deploy-pages.yml
   git add astro-site/
   git commit -m "Update GitHub Pages workflow for Astro deployment"
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to repository → Actions tab
   - Watch the workflow run
   - Check for any errors

### Option B: Manual Workflow File Update

If you haven't updated the workflow yet, I can do it for you right now.

## What Gets Deployed

From `astro-site/dist/`:
```
- index.html (optimized, 37 KB)
- media/index.html (optimized, 15 KB)
- CSS files (external, cached)
- Optimized images (AVIF, WebP, JPEG)
- Compressed PDF (2.57 MB)
- Static assets (robots.txt, sitemap.xml, etc.)
- CNAME file (for custom domain)
```

## Post-Deployment Verification

After successful deployment:

1. **Check site loads:** https://tuhinmohanta.com/
2. **Verify pages:**
   - Homepage: https://tuhinmohanta.com/
   - Media: https://tuhinmohanta.com/media
3. **Test features:**
   - Navigation links work
   - Images load (AVIF/WebP with JPEG fallback)
   - Filter tabs on media page work
   - Bio PDF downloads correctly

## Troubleshooting

### Build Fails
- Check Node.js version (needs 18+)
- Verify package-lock.json is committed
- Check for missing dependencies

### 404 Errors
- Ensure base path is correct in astro.config.mjs (currently set to `/`)
- Verify CNAME file is in public/ folder

### Images Not Loading
- Check image paths start with `/` (absolute)
- Verify images are in public/ or optimized during build

## Performance Benefits Post-Deployment

Expected Lighthouse scores on production:
- **Mobile Performance:** 85-91 (vs current 80)
- **Desktop Performance:** 85-90 (vs current 92)
- **Best Practices:** 100 (vs current 96)
- **SEO:** 100 (maintained)

First Contentful Paint:
- **Mobile:** 2.5-3.0s (vs current 3.76s)
- **Desktop:** 1.2-1.6s (vs current 1.28s)

## Next Steps

Would you like me to:
1. ✅ Update the workflow file now
2. ✅ Create a deployment checklist
3. ✅ Set up deployment monitoring

---

**Status:** Ready to deploy once workflow is updated
**Blocking Issues:** None
**Required Actions:** Update `.github/workflows/deploy-pages.yml`
