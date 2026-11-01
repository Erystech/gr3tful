# Gr3tful branding

The approved master is `gr3tful-brand-mark-v2.svg`: a bubbly joined g3, touching upper curves, burgundy tile, cream lettering, and a small peach heart at the 3's upper right. Earlier direction boards are retained here as design history.

Colours: burgundy `#4A2329`, cream `#FFF4E7`, peach `#EFA879`. Wordmark lettering comes from Nunito Black; its SIL Open Font License is in `fonts/OFL.txt`.

Run `npm run brand:generate` to regenerate `public/brand/` from the master and source font. The script exports outlined wordmarks and combined logos for light and dark backgrounds, SVG/PNG/ICO favicons, launcher icons, an Apple touch icon, a monochrome notification badge, and a 1200×630 social card. The browser never needs to download the source font for the logo.

`src/components/BrandLogo.jsx` selects the wordmark for the application's current theme. The `inverse` option selects cream lettering on dark sections such as the footer. The Home Screen icon uses the same burgundy tile in both themes.

The maskable export has a full opaque background and artwork inside the central safe circle. The Apple icon is square and opaque so the device can apply its own corner mask. The service worker cache version and manifest icon URLs were updated for this brand release; legacy icon URLs remain available while existing installations refresh.

Installation icons use content-based filenames and the manifest has a matching revision query. The generator updates these references in `index.html` and `public/manifest.webmanifest`. Standard root Apple icon and favicon fallbacks are also exported. The service worker revalidates install metadata and rejects HTML or login redirects at icon URLs.

`review/` contains local browser screenshots of the integrated homepage, account screens, and offline state. Use the stable staging branch address for Home Screen tests: `https://gr3tful-git-staging-jibrils-projects-d930e363.vercel.app/`. Each unique deployment URL is a different origin and can create a separate installed app. Installation icons must be publicly accessible to the phone; Vercel preview login can prevent their retrieval. If an existing shortcut retains a failed or older icon, remove that shortcut and add it again from the stable address.
