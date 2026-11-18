# Emlak Web

A static-exportable luxury property showcase built with Next.js and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run build` to generate the static site in `out/`; deploy that folder to any static host.

## GitHub Pages

In the repository settings under **Pages**, select **GitHub Actions** as the build and deployment source. Push to `main` to build and deploy `out/` automatically. The workflow uses the Pages site path (normally `/emlak` for this repository) as the Next.js base path; root domains use an empty path.

For a manual sub-path build, set `NEXT_PUBLIC_BASE_PATH` to the path before running `npm run build` (for example, `/emlak`). Leave it unset for local development or root hosting.

## Video walkthroughs

Place the walkthrough video at `public/videos/house.mp4` before building. The hero and all listings use this video. The room chapter timestamps in `components/video-tour.tsx` are examples; adjust them to match the video before launch.

The contact form opens WhatsApp with a pre-filled message; there is no server-side form submission or lead storage. Listings, agent information, office details, prices, and images are demonstration content and should be verified or replaced before launch.
