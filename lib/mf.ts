/**
 * Indian Mutual Fund data via mfapi.in — a free, public, no-key API
 * that mirrors AMFI's official daily NAV data.
 */

const BASE = "https://api.mfapi.in/mf";

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
}

export interface MFNavPoint {
  date: string;
  nav: string;
}

export interface MFDetail {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: MFNavPoint[];
}

let schemeCache: MFScheme[] | null = null;
let schemeCacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

async function getAllSchemes(): Promise<MFScheme[]> {
  const now = Date.now();
  if (schemeCache && now - schemeCacheTime < CACHE_TTL_MS) return schemeCache;

  const res = await fetch(BASE, { next: { revalidate: 3600 } });
  if (!res.ok) return schemeCache || [];
  const data: MFScheme[] = await res.json();
  schemeCache = data;
  schemeCacheTime = now;
  return data;
}

export async function searchMutualFunds(query: string): Promise<MFScheme[]> {
  const all = await getAllSchemes();
  const q = query.toLowerCase();
  return all.filter((s) => s.schemeName.toLowerCase().includes(q)).slice(0, 20);
}

export async function getMutualFundDetail(schemeCode: string | number): Promise<MFDetail | null> {
  const res = await fetch(`${BASE}/${schemeCode}`, { next: { revalidate: 1800 } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.status === "SUCCESS" ? false : false) {
    // mfapi returns { meta, data, status } — status check kept lenient
  }
  return data;
}
