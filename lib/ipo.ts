/**
 * NSE India exposes IPO data through an unofficial JSON endpoint that sits
 * behind basic bot protection — it requires first visiting the homepage to
 * pick up session cookies, then reusing them on the API call. This mirrors
 * what a real browser does. NSE can still occasionally block server IPs;
 * if that happens we surface a clear fallback instead of a raw 500.
 */

const HOME_URL = "https://www.nseindia.com/";
const IPO_CURRENT_URL = "https://www.nseindia.com/api/ipo-current-issue";
const IPO_UPCOMING_URL = "https://www.nseindia.com/api/all-upcoming-issues?category=equity";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
};

async function getSessionCookies(): Promise<string> {
  const res = await fetch(HOME_URL, { headers: BROWSER_HEADERS, cache: "no-store" });
  const raw = res.headers.get("set-cookie") || "";
  // Multiple cookies may arrive comma-joined in some runtimes; keep it simple
  // and forward whatever we received — NSE only checks for presence of a
  // couple of known cookie names.
  return raw;
}

async function fetchWithSession(url: string) {
  const cookie = await getSessionCookies();
  const res = await fetch(url, {
    headers: {
      ...BROWSER_HEADERS,
      Cookie: cookie,
      Referer: HOME_URL,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`NSE responded ${res.status}`);
  return res.json();
}

export async function getCurrentIPOs() {
  return fetchWithSession(IPO_CURRENT_URL);
}

export async function getUpcomingIPOs() {
  return fetchWithSession(IPO_UPCOMING_URL);
}
