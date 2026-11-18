# Emlak Web

A static-exportable luxury property showcase built with Next.js, Tailwind CSS, React Three Fiber, and Drei.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run build` to generate the static site in `out/`; deploy that folder to any static host.

## 3D tours

Place a binary glTF model at `public/models/house.glb` before building. The listings use this path by default; change `modelPath` in `lib/properties.ts` to use a different model per property. Models should be centered near the origin and scaled to fit the viewer.

If the model is absent, the tour displays a clearly labeled interactive concept home with room hotspots. It is not a representation of the listed property. The sample hotspot positions and camera destinations in `components/tour-canvas.tsx` are designed for the concept model; adjust them to match your own model before launch. Drag to orbit and scroll or pinch to zoom.

The contact form opens WhatsApp with a pre-filled message; there is no server-side form submission or lead storage. Listings, agent information, office details, prices, and images are demonstration content and should be verified or replaced before launch.
