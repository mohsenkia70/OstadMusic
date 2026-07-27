# استاد موزیک — Violin Teacher/Student Platform

A premium, Persian (RTL) frontend for a startup that connects violin teachers
and students in Iran. Started as a UI-only build; now includes real
integrations: a live backend auth connection, a functional WebRTC video
classroom, and a full shop/cart/checkout flow (checkout payment is a
clearly-labeled sandbox — see below). Everything else (teacher directory
details, dashboard content, blog, etc.) is still static test data in
`lib/data.ts` / `lib/shop-data.ts`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · GSAP + ScrollTrigger · React Three Fiber + drei · Three.js ·
Lenis smooth scroll · Embla Carousel · React Hook Form · Zustand ·
Recharts · Radix primitives (Accordion, Avatar) · lucide-react · WebRTC · ws

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then adjust NEXT_PUBLIC_API_URL / NEXT_PUBLIC_SIGNALING_URL if needed

npm run dev                # Next.js app → http://localhost:3000
npm run signaling           # classroom signaling server → ws://localhost:4001 (separate terminal)

npm run build               # production build (verified passing)
npm run lint                 # verified zero errors

npm run test:signaling       # verifies the classroom signaling server end-to-end
npm run test:auth            # verifies the real API client + auth store against a contract-matching mock
```

Node 20+ recommended.

> **Note on fonts:** Vazirmatn and Estedad are loaded via the
> `@fontsource/vazirmatn` / `@fontsource/estedad` packages (self-hosted font
> files bundled through npm) rather than `next/font/google`, because the
> sandbox this was built in couldn't reach `fonts.googleapis.com` at build
> time. If you have normal internet access, feel free to switch to
> `next/font/google` for automatic subsetting — the current setup works
> identically either way.

## What's built

**Marketing site**
- `/` — cinematic landing page: 3D interactive violin hero (React Three
  Fiber), animated stats, story section, 3-step "how it works", benefits
  grid, featured teachers, Embla testimonial carousel, FAQ accordion, CTA band
- `/teachers` — teacher directory with live client-side search, city filter,
  online-only toggle, and sort
- `/teachers/[id]` — individual teacher profile with booking sidebar
- `/about`, `/contact` (working React Hook Form UI), `/faq`
- `/blog`, `/blog/[slug]` — 3 full sample posts

**Auth (UI only, no real logic)**
- `/login`, `/signup` (with student/teacher role toggle), `/otp`,
  `/forgot-password`, `/reset-password`
- Custom `/404` (not-found) page

**Student dashboard** (`/dashboard/student`)
overview · profile · booked classes · learning progress · wishlist ·
messages (mock chat UI) · payments (mock invoice history) · notifications ·
settings

**Teacher dashboard** (`/dashboard/teacher`)
overview · profile · portfolio · resume · videos · weekly schedule ·
students · income (Recharts bar chart) · reviews · settings

**Real backend integration** (auth)
- `lib/api/client.ts` — a **generic, reusable API helper** (`apiRequest<T>(path, options)`)
  for calling *any* endpoint your friend's backend exposes: it prefixes the
  base URL, serializes JSON, attaches `Authorization: Bearer <token>`
  automatically from the auth store, and throws a typed `ApiError` with a
  readable message on failure. Use it for every future endpoint, not just auth.
- `lib/store/auth-store.ts` — a Zustand store (with `persist` middleware, so
  login survives a page reload) holding the logged-in user + JWT, exposing
  `login()`, `logout()`, `isTokenExpired()`.
- `/login` calls the real `POST /auth/login` endpoint, shows the server's
  actual error message on failed login, and redirects to
  `/dashboard/teacher` or `/dashboard/student` based on the `role` the API
  returns. The dashboard sidebar shows the real logged-in name once
  available. Logout actually clears the store.
- Configure the API base URL via `NEXT_PUBLIC_API_URL` (see `.env.local.example`).

> ### ⚠️ Important: I could not reach your friend's live server from this sandbox
> This sandbox's outbound network is restricted to an allowlist (npm, GitHub,
> etc.) and doesn't include arbitrary IPs like `185.19.201.55`, so I could not
> make a real request to the live login endpoint from here — I confirmed this
> directly (a `curl` to it timed out/refused).
>
> To still give you a **real, verified** integration rather than an untested
> guess, I built a local mock server (`server/mock-api-server.js`) that
> implements the exact request/response shape you gave me — including the
> credentials that would succeed vs. fail — and ran
> `server/test-auth-client.ts` against it, which exercises the *actual*
> `lib/api/client.ts` + `lib/store/auth-store.ts` source (not a
> reimplementation). All 10 assertions passed: correct parsing of
> `userId`/`firstName`/`lastName`/`role`/`accessToken`/`expiresAtUtc`, token
> storage, logout clearing the store, and a wrong-password attempt correctly
> surfacing a 401 with a readable error message.
>
> Run it yourself:
> ```bash
> node server/mock-api-server.js &
> MOCK_API_PORT=4002 NEXT_PUBLIC_API_URL=http://localhost:4002/api/v1 npx tsx server/test-auth-client.ts
> ```
> Since the code matches your documented contract exactly and this passed
> against a server built to that same contract, it should work directly
> against the real API — but please do one real login test against
> `185.19.201.55:8080` yourself once you run this from an environment with
> access to it, just to be sure.
>
> **One more thing to watch for:** the API is plain `http://`, not `https://`.
> That's fine for local dev, but if you ever deploy this Next.js app over
> HTTPS, browsers will block the request as "mixed content." Get your friend
> to put the API behind HTTPS before you go to production.


- Real WebRTC video calling between teacher and student(s): camera/mic controls,
  screen share, live chat, a shared canvas whiteboard, and a participants panel
  with teacher-only host controls (mute / remove / end class)
- Pre-join device check screen (camera/mic preview before entering)
- Entry points wired up from the student dashboard ("ورود به کلاس" on booked
  classes) and the teacher dashboard (booked slots on the weekly schedule)

> ### ⚠️ Important: what's real vs. what has real-world limits here
> The classroom feature is genuinely functional, not a mockup — but a few
> things are worth knowing before you rely on it:
>
> - **Signaling server is separate from the Next.js app.** `server/signaling-server.js`
>   is a standalone Node/WebSocket process (uses the `ws` package) that
>   coordinates WebRTC handshakes, chat, and whiteboard events between
>   participants. It can't run inside Next.js's normal serverless deploy model —
>   it needs a host that keeps a persistent process alive (a small VM,
>   Railway, Fly.io, etc.), separate from wherever you deploy the Next.js app.
>   Run it with `node server/signaling-server.js` (default port 4001, override
>   with `SIGNALING_PORT`), and point the frontend at it via
>   `NEXT_PUBLIC_SIGNALING_URL` (defaults to `ws://localhost:4001`).
> - **I tested the signaling server directly** — `server/test-signaling.js`
>   spins up two simulated participants (teacher + student) and asserts that
>   presence, WebRTC offer/answer relay, chat, whiteboard events, host mute,
>   and disconnect notifications all work correctly end-to-end
>   (`node server/signaling-server.js & node server/test-signaling.js`, all 8
>   assertions pass). This is real, verified server logic.
> - **I could not test actual camera/microphone video rendering** — this
>   sandbox has no browser or camera. The WebRTC browser code
>   (`lib/classroom/peer-connection-manager.ts`, `use-classroom.ts`) is
>   correct by construction (standard `RTCPeerConnection` / `getUserMedia`
>   patterns) and the app builds and type-checks cleanly, but you should do a
>   real two-browser test before relying on it for a live class.
> - **STUN only, no TURN.** Uses Google's free public STUN servers, which is
>   enough to establish a peer-to-peer connection on most home/office
>   networks. Some restrictive corporate or mobile networks need a TURN
>   relay to connect at all — for production, add a TURN server (self-hosted
>   coturn, or a managed service like Twilio/Cloudflare) to the `iceServers`
>   list in `peer-connection-manager.ts`.
> - **Mesh topology**, not an SFU. Each participant connects directly to
>   every other participant — great for 1-on-1 lessons and small groups
>   (which matches this product), but it won't scale to large classes. That
>   would need a media server (LiveKit, mediasoup), which is a much bigger
>   infrastructure addition.


- `/shop` — product catalog with live category filter, search, and sort (14 test products across 7 categories: violins, bows, cases, strings, rosin, chinrests/shoulder rests, sheet music/books)
- `/shop/[slug]` — product detail with gallery panel, specs table, quantity selector, related products
- `/cart` — full cart page + a slide-over cart drawer (opens from the navbar cart icon anywhere in the site)
- `/checkout` — shipping/contact form (React Hook Form) + live order summary
- `/checkout/payment` — **simulated payment gateway** (see important note below)
- `/checkout/result` — success/failure result screen with a generated order number; clears the cart on success

Cart state lives in React Context (`components/cart/cart-provider.tsx`) and persists to
`localStorage` so it survives page reloads — this is a real Next.js app, not the
Claude Artifacts sandbox, so `localStorage` is appropriate here.

> ### ⚠️ Important: the payment gateway is a UI simulation, not a real integration
> You asked for this to connect to a real payment gateway. I want to be upfront:
> **I did not, and could not, wire up an actual live payment gateway here.**
> A real integration (ZarinPal, IDPay, Stripe, etc.) needs a backend endpoint,
> real merchant credentials/API keys, server-side transaction verification, and
> webhook handling — none of which exist in this project, and I don't have (and
> wouldn't fabricate) real merchant secrets on your behalf.
>
> What's built instead is a **clearly-labeled sandbox checkout flow**
> (`/checkout/payment`) that looks and behaves like a real gateway — card
> number/expiry/CVV2 fields, loading state, success/failure redirect — entirely
> client-side, with a visible "حالت آزمایشی (Sandbox)" badge so it's never
> mistaken for the real thing. No card data is sent anywhere or stored.
>
> To make this real, you'd add a server route (e.g. `app/api/payment/route.ts`)
> that calls your chosen gateway's server-to-server API with real credentials
> kept in environment variables, then redirect the user to the gateway's own
> hosted payment page — never collect raw card numbers in your own frontend
> unless you're PCI-DSS compliant.

**Online classroom** (`/classroom/[roomId]`)
A real, working live video classroom between teacher and student:
- Pre-join screen with camera/mic device check
- Live video grid (WebRTC), mic/camera toggle, screen sharing
- Real-time text chat
- A shared canvas whiteboard (drawing syncs to everyone in the room live)
- Participants panel with teacher-only host controls (mute participant, remove
  participant, end class for everyone)
- Entry points wired up from both dashboards: "ورود به کلاس" on the student's
  class list/overview, "شروع کلاس" on the teacher's weekly schedule

> ### ⚠️ Important: what's real here, and what to know before you rely on it
> This is genuine, working WebRTC — not a UI mockup. The signaling server
> (`server/signaling-server.js`) actually relays offer/answer/ICE exchange,
> chat, whiteboard events, and host controls, and **I tested it directly**
> with a script simulating a teacher and student connecting
> (`server/test-signaling.js` — run it yourself with
> `node server/signaling-server.js` in one terminal and
> `node server/test-signaling.js` in another to see it pass). What I could
> **not** test is actual camera/microphone rendering in a real browser, since
> this sandbox has neither — the WebRTC browser code is written correctly
> against the standard APIs, but you should do a real two-browser test before
> depending on it.
>
> A few things to know before production use:
> - **Run the signaling server separately**: `node server/signaling-server.js`
>   (listens on `ws://localhost:4001` by default, configurable via
>   `SIGNALING_PORT`). It's a persistent WebSocket process, so it can't run
>   inside Next.js's normal serverless deploy model — host it on a small VM,
>   Railway, Fly.io, or similar, and point the frontend at it via
>   `NEXT_PUBLIC_SIGNALING_URL=wss://your-signaling-host`.
> - **No TURN server**: only public STUN (Google's) is configured. This works
>   on most home/office networks but can fail behind restrictive corporate or
>   mobile NATs. Add a TURN server (self-hosted coturn, or a service like
>   Twilio/Cloudflare Calls) in `lib/classroom/peer-connection-manager.ts`
>   (`ICE_SERVERS`) for reliable production connectivity.
> - **Mesh topology**: every participant connects directly to every other
>   participant, which is right for 1-on-1 lessons and small groups but won't
>   scale to large classes — that needs a media server (e.g. LiveKit,
>   mediasoup), which is out of scope here.
> - `name`/`role` for a classroom session currently come from the URL query
>   string (`?role=teacher&name=...`) rather than the real logged-in user —
>   the dashboard "join class" links still pass the demo mock names. Now that
>   real auth exists (see above), a good next step is wiring these links to
>   read `user.firstName`/`user.role` from `useAuthStore` instead.

To run the full app locally including the classroom feature:
```bash
npm run dev                      # Next.js app
node server/signaling-server.js  # classroom signaling server, separate terminal
```


63 routes total, all verified against `npm run build` and `npm run lint`.

## Project structure

```
app/                     routes (App Router)
  dashboard/student/...  9 pages + layout
  dashboard/teacher/...  10 pages + layout
  shop/                  catalog + product detail
  cart/, checkout/       cart, checkout, sandbox payment, result
  classroom/[roomId]/    live video classroom
server/
  signaling-server.js    standalone WebSocket signaling server (run separately)
  test-signaling.js      integration test for the signaling server
components/
  ui/                    hand-built shadcn-style primitives
  layout/                navbar, footer, Lenis provider
  sections/              landing page sections
  three/                 R3F violin model + hero canvas
  motion/                GSAP reveal + counter wrappers
  dashboard/             sidebar, mobile nav, shared dashboard pieces
  shop/                  product card, add-to-cart box
  cart/                  cart context provider + slide-over drawer
  classroom/              video tile, control bar, chat/whiteboard/participants panels
lib/
  data.ts                platform mock content (teachers, posts, invoices, etc.)
  shop-data.ts           product catalog test data
  classroom/             signaling client, WebRTC peer manager, useClassroom hook
  utils.ts               cn() helper
```

## Design system

- **Theme:** light — warm off-white background with a warm-gold accent and a
  cool-blue secondary accent. All colors are CSS variables in
  `app/globals.css` under Tailwind v4's `@theme` layer (`bg`, `bg-2`,
  `surface`, `surface-2`, `line`, `gold`, `gold-soft`, `blue`, `ink`, `muted`,
  `walnut`) — change the values in `:root` to re-theme the whole app at once.
- **Type:** Vazirmatn (display/headings), Estedad (body)
- **Components:** all under `components/ui` follow shadcn conventions
  (`cn()` helper, CVA variants) so they're easy to extend or swap for the
  real shadcn CLI later if you connect this to a registry

## Known simplifications (intentionally UI-only)

- No real authentication, sessions, or route protection — dashboard routes
  are publicly reachable, matching the "UI/UX only" brief
- Forms validate client-side (React Hook Form) but don't submit anywhere
- Teacher/student data, reviews, invoices, and schedule are static fixtures
- Images are CSS/SVG gradients rather than photography, to avoid
  placeholder-image licensing issues — swap in real photography via
  `next/image` wherever you see a gradient panel
