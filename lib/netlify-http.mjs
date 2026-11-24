const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map();

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer"
    }
  });
}

export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function rateLimited(request, context, key, limit) {
  const now = Date.now();
  const ip = context?.ip ||
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const bucketKey = key + ":" + ip;
  const current = buckets.get(bucketKey);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(bucketKey, { startedAt: now, count: 1 });
    if (buckets.size > 1000) {
      for (const [name, bucket] of buckets) {
        if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(name);
      }
    }
    return false;
  }

  current.count += 1;
  return current.count > limit;
}

export function envValue(name) {
  try {
    const value = globalThis.Netlify?.env?.get(name);
    if (value) return value;
  } catch {}
  return process.env[name];
}
