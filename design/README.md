# Gr3tful branding

The approved master is `gr3tful-brand-mark-v2.svg`: a bubbly joined g3, touching upper curves, burgundy tile, cream lettering, and a small peach heart at the 3's upper right. Earlier direction boards are retained here as design history.

Colours: burgundy `#4A2329`, cream `#FFF4E7`, peach `#EFA879`. Wordmark lettering comes from Nunito Black; its SIL Open Font License is in `fonts/OFL.txt`.

Run `npm run brand:generate` to regenerate `public/brand/` from the master and source font. The script exports outlined wordmarks and combined logos for light and dark backgrounds, SVG/PNG/ICO favicons, launcher icons, an Apple touch icon, a monochrome notification badge, and a 1200×630 social card. The browser never needs to download the source font for the logo.

`src/components/BrandLogo.jsx` selects the wordmark for the application's current theme. The `inverse` option selects cream lettering on dark sections such as the footer. The Home Screen icon uses the same burgundy tile in both themes.

The maskable export has a full opaque background and artwork inside the central safe circle. The Apple icon is square and opaque so the device can apply its own corner mask. The service worker cache version and manifest icon URLs were updated for this brand release; legacy icon URLs remain available while existing installations refresh.

`review/` contains local browser screenshots of the integrated homepage, account screens, and offline state. The staging deployment is the review target before merging to main. If a previously installed staging shortcut retains the old icon, remove that shortcut and add it again from the latest staging deployment.
