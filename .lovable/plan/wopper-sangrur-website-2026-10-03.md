# Wopper Sangrur website

## What you get
A dark, premium, energetic multi-page site with vivid neon accents, bold display headings, generated venue-style imagery (no fake customers), and clear booking paths.

Pages:
- **Home** – hero "PLAY. JUMP. COMPETE. REPEAT.", hours/location strip, experience cards, why visit, birthday section, group/corporate section, gallery preview, 4.6/5 (192 reviews) badge with source attribution, location + map.
- **Experiences** – Bowling, Arcade Games, VR Games, Trampoline, Wall Climbing, Pit Ball (all confirmed). No invented ages or prices.
- **Parties & Events** – birthdays, family, friends, corporate, kitty parties; "Ask about available packages"; event enquiry form.
- **Gallery** – masonry grid, activity filters, lightbox.
- **About** – "MORE THAN JUST A GAME", no invented history.
- **Contact** – address, phone, hours, map, directions/call/WhatsApp, FAQ (unknowns answered "Please contact Wopper Sangrur for the latest information").
- **Book** – enquiry form (name, phone, email optional, date, time, people, activity, visit type, message) with confirmation message.

Everywhere: simple nav with "Book / Enquire" button, mobile hamburger, mobile sticky bar (Call / WhatsApp / Book), floating WhatsApp button, pre-filled WhatsApp messages including the event type.

## Enquiries
Each form saves the enquiry and then opens WhatsApp with the details pre-filled. A private, password-protected admin page lists all enquiries for staff.

## Technical details
- Lovable Cloud: `enquiries` table (insert open to public, read limited to admins via `user_roles` + `has_role`), admin login, `/admin` route under an auth gate.
- Zod validation client + server; server function for inserts.
- Design tokens in `src/styles.css` (oklch dark base, neon lime/hot-orange accents, glow shadows), display font (e.g. Bricolage Grotesque / Archivo) + readable body sans via `<link>` in root.
- Per-route head() metadata, LocalBusiness JSON-LD, alt text, focus states, light scroll-reveal animations.
- 6–8 generated images saved in `src/assets`.
