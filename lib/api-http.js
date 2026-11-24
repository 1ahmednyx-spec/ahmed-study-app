export function sendJson(res, status, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  return res.status(status).json(data);
}

export function allowSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const forwardedHost = req.headers["x-forwarded-host"];
    const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || req.headers.host;
    return Boolean(host) && originUrl.host.toLowerCase() === String(host).toLowerCase();
  } catch {
    return false;
  }
}

const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map();

export function isRateLimited(req, key, limit) {
  const now = Date.now();
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "").split(",")[0].trim() || "unknown";
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
