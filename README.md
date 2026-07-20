# GALO — Nonprofit Website

A static website for **GALO**, a nonprofit running sports-based active
learning programs for kids and youth. No build tools, frameworks, or server
required — it's plain HTML/CSS/JS, so it can be pushed straight to GitHub
and hosted for free on GitHub Pages with your own domain.

> **Everything in here is placeholder content** — organization name, address,
> phone, email, EIN, board bios, sample events, and donation links. See the
> **"Before you publish" checklist** below for exactly what to replace.

## Project structure

```
groundwork-website/
├── index.html          Home page
├── about.html           Mission, story, values, board/staff
├── programs.html         Program listings
├── events.html           Upcoming events table
├── volunteer.html        Volunteer roles + interest form
├── donate.html           Giving tiers + other ways to give
├── contact.html          Contact form + office info
├── css/
│   └── styles.css        All site styling (single stylesheet)
├── js/
│   └── main.js           Mobile nav toggle, active-link highlighting, form handling
├── images/
│   └── favicon.svg       Site icon
├── .nojekyll             Tells GitHub Pages not to run Jekyll processing
├── .gitignore
└── README.md
```

## Design notes

The visual identity is built around the idea of an athletic field/track:
- A dashed header border and "lane divider" section breaks (the striped
  bars with a circular badge) echo painted field lines.
- Stats are shown in a scoreboard-style block with a monospace numeral font.
- Numbered steps are only used where content is a genuine sequence (like
  "how to get involved"), not as generic decoration.
- Palette: navy (`#16233F`), turf green (`#2F6B4F`), chalk off-white
  (`#F6F5EF`), optic yellow (`#D7E021`), and clay/track red-orange (`#C1441E`).
- Fonts: Anton (headlines), Work Sans (body), Space Mono (stats/labels/nav),
  loaded from Google Fonts via CDN link in each page's `<head>`.

All styles live in `css/styles.css` — change the CSS custom properties at
the top of that file to adjust colors, fonts, and spacing sitewide.

## Running it locally

No install needed. Either:
- Open `index.html` directly in a browser, or
- Serve it locally so relative paths behave exactly like production:
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Pushing to GitHub

```bash
cd groundwork-website
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

## Hosting on GitHub Pages with your own domain

1. In your GitHub repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
3. Under **Custom domain**, enter your domain (e.g. `www.yournonprofit.org`)
   and save. GitHub will create a `CNAME` file in your repo automatically —
   if it doesn't, create a file named `CNAME` (no extension) at the project
   root containing just your domain, one line, no `https://`.
4. At your domain registrar, add the DNS records GitHub's docs specify:
   - A CNAME record pointing `www` (or your chosen subdomain) to
     `YOUR-ORG.github.io`
   - Or, for an apex/root domain (`yournonprofit.org` with no subdomain),
     four A records pointing to GitHub Pages' IP addresses, which GitHub's
     Pages settings page lists directly.
5. Check **Enforce HTTPS** once DNS has propagated (can take up to 24 hours).

Full current instructions (in case anything above has changed): search
"GitHub Pages custom domain" in GitHub's docs.

## Making the forms actually work

The **contact form** (`contact.html`) submits to a placeholder endpoint
(`YOUR_FORM_ENDPOINT`) and won't deliver anywhere until you connect a form
backend — GitHub Pages can't run server-side code. Easiest options:

- **Formspree** (formspree.io) — free tier, no code changes needed beyond
  replacing the `action="https://formspree.io/f/YOUR_FORM_ENDPOINT"` URL in
  `contact.html` with the endpoint Formspree gives you.
- **Netlify Forms** — if you host on Netlify instead of GitHub Pages, add
  a `netlify` attribute to the form and it works automatically.

The **program registration** (`programs.html`) and **volunteer sign-up**
(`volunteer.html`) forms are set up as embedded Google Forms instead —
see the setup steps below.

## Setting up the embedded Google Form (registration & volunteering)

Both `programs.html` (in the "Register for a program" section) and
`volunteer.html` currently show a placeholder embed with `GOOGLE_FORM_ID`
in the iframe `src`. To connect your real form:

1. Go to [forms.google.com](https://forms.google.com) and create a new form
   (one for program registration, one for volunteer sign-up — or one shared
   form with a "What are you signing up for?" question, if you'd rather
   manage just one).
2. Add whatever fields you need — name, email, phone, program/role,
   child's age, emergency contact, etc.
3. Click **Send** (top right) → the `<>` embed icon → copy the `src` URL
   from the `<iframe>` code Google gives you. It looks like:
   `https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxxxxxxxx/viewform?embedded=true`
4. In `programs.html` and/or `volunteer.html`, replace
   `GOOGLE_FORM_ID` inside the iframe `src` with the ID from that URL
   (the long string between `/d/e/` and `/viewform`).
5. Remove the yellow "Placeholder embed" note (`<div class="embed-note">…`)
   once it's live.
6. In your Google Form's **Responses** tab, click the Sheets icon to send
   responses straight to a Google Sheet you can check anytime.

Tip: under Form Settings, turn on **"Collect email addresses"** and
**"Limit to 1 response"** if you want to prevent duplicate sign-ups.

## Setting up the embedded Google Calendar (events page)

`events.html` shows a placeholder embedded calendar and an "Add our
calendar to yours" button, both using `GOOGLE_CALENDAR_ID`. To connect
your real calendar:

1. In [Google Calendar](https://calendar.google.com), create a new calendar
   dedicated to Groundwork events (Settings → **Add calendar** → **Create
   new calendar**) rather than using a personal one.
2. Open that calendar's settings → **Access permissions** → check
   **"Make available to public"** (choose "See all event details").
3. Scroll to **Integrate calendar** and copy the **Calendar ID** — it looks
   like `abc123xyz@group.calendar.google.com`.
4. In `events.html`, replace both instances of `GOOGLE_CALENDAR_ID` (in the
   iframe `src` and in the "Add our calendar to yours" button href) with
   your real ID, URL-encoding the `@` as `%40` if it isn't already.
5. Remove the yellow "Placeholder embed" note once it's live.
6. Add your real events directly in Google Calendar going forward — the
   embed updates automatically, no code changes needed.

The individual **"+ Add"** buttons next to each row in the events table are
separate, one-off links (using Google's calendar-event template URL) that
let a visitor add just that one event to their own calendar without
subscribing to your whole feed. These are pre-filled with the sample dates
above — once you replace the sample events with real ones, update the
`dates=`, `text=`, `details=`, and `location=` values in each link to match
(the format is `YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ` in UTC — the sample
times assume US Eastern time, so double-check the UTC offset for your
timezone and season).

## Before you publish — replace these placeholders

- [ ] Organization legal name, EIN, and 501(c)(3) status line (in every footer)
- [ ] Address, phone, and email (every footer, `contact.html`, `donate.html`)
- [ ] Real logo (currently a text wordmark + `images/favicon.svg`)
- [ ] Board/staff bios and photos (`about.html`)
- [ ] Program schedules, locations, and pricing (`programs.html`)
- [ ] Real upcoming events (`events.html` — currently sample data)
- [ ] Donation processor link — Donorbox, PayPal Giving Fund, Stripe, etc. (`donate.html`)
- [ ] Contact form backend endpoint (`contact.html` — see above)
- [ ] Google Form ID for registration/volunteer sign-up (`programs.html`, `volunteer.html` — see above)
- [ ] Google Calendar ID for the events embed (`events.html` — see above)
- [ ] Individual "+ Add" calendar links per event, once real dates replace the samples (`events.html`)
- [ ] Testimonial quote — replace or confirm you have permission to use it (`index.html`)
- [ ] Social media links, if you want them in the footer (not included yet)
- [ ] Page titles/meta descriptions if the org name or focus changes

## License / content

All copy, colors, and layout here are original placeholder content for you
to edit freely — nothing needs attribution.
