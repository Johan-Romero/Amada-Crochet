const PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/i;

function normalizeSupabaseUrl(rawValue: string) {
  const value = rawValue.trim();

  if (PROJECT_REF_PATTERN.test(value)) {
    return `https://${value}.supabase.co`;
  }

  const parsed = new URL(value);

  if (parsed.hostname === "supabase.com" || parsed.hostname === "www.supabase.com") {
    const dashboardMatch = parsed.pathname.match(/\/dashboard\/project\/([a-z0-9]+)/i);
    if (dashboardMatch?.[1]) {
      return `https://${dashboardMatch[1]}.supabase.co`;
    }
  }

  return parsed.toString().replace(/\/+$/, "");
}

export function getSupabaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!raw || !raw.trim()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  try {
    return normalizeSupabaseUrl(raw);
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  }
}

export function getSupabasePublishableKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!key || !key.trim()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return key.trim();
}
