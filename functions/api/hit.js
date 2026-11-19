// Count-only tracking for the talk pages: one number per page (or download) per day.
// No cookies, no IP addresses, no user agents are read or stored.
const VIEWS = new Set(["/talks/nordpak-2026", "/talks/nordpak-2026-resources"]);
const DOWNLOADS = new Set([
  "talk-deck.zip", "talk-audience-review.zip", "talk-gap-review.zip",
  "nordpak-2026-skills.zip", "talk-deck-example.html",
]);
const ORIGINS = new Set(["https://zahid.cc", "https://www.zahid.cc"]);

export async function onRequestPost({ request, env }) {
  const done = new Response(null, { status: 204 });
  try {
    if (!ORIGINS.has(request.headers.get("Origin") || "")) return done;
    const body = JSON.parse((await request.text()).slice(0, 300));
    const ok = (body.e === "view" && VIEWS.has(body.n)) || (body.e === "download" && DOWNLOADS.has(body.n));
    if (!ok) return done;
    const day = new Date().toISOString().slice(0, 10);
    const key = `${body.e}:${body.n}:${day}`;
    const current = parseInt((await env.COUNTS.get(key)) || "0", 10);
    await env.COUNTS.put(key, String(current + 1));
  } catch (e) { /* counting must never break a page */ }
  return done;
}
