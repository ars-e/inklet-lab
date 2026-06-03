# UrbanMor Subpath Deploy (`/umv1`)

This site serves UrbanMor as a hidden subpath under `inkletlab.com/umv1`.

## One-time setup

- UrbanMor frontend path default: `../UrbanMor/frontend`
- Sync command from this repo:

```bash
cd /Users/ars-e/projects/inklet-lab-site
npm run sync:umv1
```

By default, the built UrbanMor frontend will call API at `/umv1-api`.

## Set production API origin (recommended)

If your backend is hosted elsewhere, set it while syncing:

```bash
cd /Users/ars-e/projects/inklet-lab-site
VITE_API_BASE_URL="https://<your-backend-host>" npm run sync:umv1
```

## Deploy

After syncing, commit `public/umv1` and deploy this site normally.

```bash
cd /Users/ars-e/projects/inklet-lab-site
git add public/umv1 package.json scripts/sync-umv1.sh scripts/sync-urbanmorph.sh vercel.json docs/urbanmorph-deploy.md
git commit -m "Deploy UrbanMor under /umv1"
git push
```

## Visibility

- No navigation links are added.
- `X-Robots-Tag: noindex, nofollow, noarchive` is set for `/umv1` paths.
