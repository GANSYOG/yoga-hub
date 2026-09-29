# Yoga Hub — Malad East · Production Website

**Tagline:** Transform Your Body, Transform Your Life · Since 2016
**Stack:** Zero-build static SPA (HTML + CSS + JS) — deploy anywhere. Backend stub: Node/Express + Prisma/Postgres.

## Run locally
Just open `index.html` in a browser (double-click). No build needed.
Optional API: `node backend/server.js` (after `npm i express cors helmet express-rate-limit zod dotenv`).

## Configure business data (once)
- `js/siteConfig.js` — phone/WhatsApp/email, hours, schedule, pricing, maps, socials, analytics IDs.
  - ⚠️ Replace `whatsappNumber` / `phoneHref` / `phoneDisplay` with the current business number.
- `js/data.js` — programs, specials, FAQs, gallery list, TTC modules.
- Testimonials: `testimonials: []` stays EMPTY until real member stories are supplied — the UI honestly shows "Real member experiences coming soon."

## Add real photos
Drop JPGs into `assets/` per `assets/README.txt`. Hero/About auto-swap; gallery lightbox included.

## Routes (hash SPA — all 21 pages + SEO aliases)
`#/ #/about #/classes #/therapy #/weight-management #/personal #/corporate #/senior #/women #/back-pain-yoga-malad #/belly-reset #/ttc #/ttc-200-hours #/ttc-300-hours #/testimonials #/gallery #/contact #/free-trial #/faq #/privacy #/terms`
Aliases: `#/yoga-classes-malad-east #/yoga-therapy-malad #/personal-yoga-malad #/corporate-yoga-mumbai #/senior-citizen-yoga-malad #/yoga-teacher-training-mumbai …`

## Deploy
- **Vercel/Netlify:** drag-drop the folder, or `vercel --prod`. Any static host works.
- Backend: deploy `backend/server.js` to Render/Railway/Fly, set `DATABASE_URL`, run `prisma migrate deploy`.

## Quality notes
- No fake reviews, certifications, awards, or medical-cure claims anywhere.
- Leads: validated frontend + Zod backend, rate-limited, `NEW→CONTACTED→TRIAL_BOOKED→TRIAL_COMPLETED→CONVERTED/LOST`.
- Accessibility: skip link, labels, focus styles, keyboard lightbox, `prefers-reduced-motion`.
- Performance: system-safe (no framework JS), lazy images/iframes, preconnected fonts only.
