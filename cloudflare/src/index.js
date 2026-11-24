import { neon } from "@neondatabase/serverless";
import { getProviderDiagnostics } from "./provider-diagnostics.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_DB_REQUESTS = 60;
const MAX_INPUT_CHARS = 20000;
const requestBuckets = new Map();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function isRateLimited(request, maxRequests = MAX_REQUESTS) {
  const now = Date.now();
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const current = requestBuckets.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    if (requestBuckets.size > 1000) {
      for (const [bucketKey, bucket] of requestBuckets) {
        if (now - bucket.startedAt >= WINDOW_MS) requestBuckets.delete(bucketKey);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > maxRequests;
}

function normalizeInput(input) {
  if (typeof input === "string") {
    return input.trim() && input.length <= MAX_INPUT_CHARS ? input.trim() : null;
  }
  if (!Array.isArray(input) || input.length === 0 || input.length > 20) return null;
  const transcript = [];
  for (const item of input) {
    if (!item || typeof item.content !== "string" || !item.content.trim() ||
        item.content.length > 10000 || !["user", "assistant", "model"].includes(item.role)) {
      return null;
    }
    const speaker = item.role === "assistant" || item.role === "model" ? "المساعد" : "الطالب";
    transcript.push(speaker + ": " + item.content.trim());
  }
  const combined = transcript.join("\n\n");
  return combined.length <= MAX_INPUT_CHARS ? combined : null;
}

async function handleAI(request, env) {
  if (request.method !== "POST") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: { code: "forbidden_origin" } }, 403);
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: { code: "missing_server_secret" } }, 503);
  }

  if (isRateLimited(request)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const input = normalizeInput(body?.input);
  if (!input) {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const requestBody = {
    model: env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    input,
    store: false
  };
  if (body?.responseFormat === "json") {
    requestBody.response_format = { type: "text", mime_type: "application/json" };
  }

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
  } catch {
    return json({ error: { code: "provider_unavailable" } }, 502);
  }

  if (!upstream.ok) {
    // Return only the provider HTTP status and a strictly validated status code.
    // Never expose provider messages, request content, headers, or credentials.
    const diagnostics = await getProviderDiagnostics(upstream);
    if (upstream.status === 429) {
      return json({ error: { code: "rate_limited", ...diagnostics } }, 429);
    }
    if (upstream.status === 400) {
      return json({ error: { code: "provider_bad_request", ...diagnostics } }, 400);
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return json({ error: { code: "invalid_api_key", ...diagnostics } }, 502);
    }
    return json({ error: { code: "provider_error", ...diagnostics } }, 502);
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return json({ error: { code: "invalid_provider_response" } }, 502);
  }

  const text = (result?.steps || [])
    .filter(step => step.type === "model_output")
    .flatMap(step => step.content || [])
    .map(part => typeof part.text === "string" ? part.text : "")
    .join("")
    .trim();

  if (!text || result?.status !== "completed") {
    return json({ error: { code: "empty_response" } }, 502);
  }

  return json({ text });
}

/*
 * Phase 1 database API is intentionally read-only.
 * It exposes only published educational content; no student records or writes.
 */
async function handleDatabase(request, env, url) {
  if (request.method !== "GET") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) {
    return json({ error: { code: "forbidden_origin" } }, 403);
  }

  const isHealth = url.pathname === "/api/db/health";
  const isSubjects = url.pathname === "/api/db/subjects";
  const lessonMatch = url.pathname.match(/^\/api\/db\/subjects\/([0-9a-f-]{36})\/lessons$/i);
  if (!isHealth && !isSubjects && !lessonMatch) {
    return json({ error: { code: "not_found" } }, 404);
  }

  if (!env.DATABASE_URL) {
    return json({ error: { code: "database_not_configured" } }, 503);
  }

  if (isRateLimited(request, MAX_DB_REQUESTS)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  try {
    const sql = neon(env.DATABASE_URL);

    if (isHealth) {
      const rows = await sql`SELECT 1 AS ok`;
      return json({
        ok: rows[0]?.ok === 1,
        service: "ahmed-study-database",
        database: rows[0]?.ok === 1 ? "connected" : "unavailable"
      });
    }

    if (isSubjects) {
      const subjects = await sql`
        SELECT id, name, description, sort_order
        FROM subjects
        WHERE is_published = TRUE
        ORDER BY sort_order ASC, name ASC
        LIMIT 100
      `;
      return json({ data: subjects });
    }

    const subjectId = lessonMatch[1];
    const lessons = await sql`
      SELECT id, subject_id, title, content, sort_order
      FROM lessons
      WHERE subject_id = ${subjectId}
        AND is_published = TRUE
      ORDER BY sort_order ASC, title ASC
      LIMIT 100
    `;
    return json({ data: lessons });
  } catch {
    return json({ error: { code: "database_unavailable" } }, 503);
  }
}


const APP_ORIGIN = "https://1ahmednyx-spec.github.io";
const API_PUBLIC_HEADERS = {"access-control-allow-methods":"GET, POST, PUT, DELETE, OPTIONS","access-control-allow-headers":"Authorization, Content-Type","access-control-max-age":"86400","vary":"Origin"};
function apiJson(data,status=200,origin=""){const headers={...JSON_HEADERS,...API_PUBLIC_HEADERS};if(origin===APP_ORIGIN||origin==="http://localhost:8787"||origin==="http://127.0.0.1:8787")headers["access-control-allow-origin"]=origin;return new Response(JSON.stringify(data),{status,headers});}
function validApiOrigin(origin){return !origin||origin===APP_ORIGIN||origin==="http://localhost:8787"||origin==="http://127.0.0.1:8787";}
function b64url(bytes){let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");}
function fromB64url(value){const normalized=value.replace(/-/g,"+").replace(/_/g,"/");const binary=atob(normalized+"=".repeat((4-normalized.length%4)%4));return Uint8Array.from(binary,char=>char.charCodeAt(0));}
async function hmacKey(secret,usage){return crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,usage);}
async function issueAdminToken(email,secret){const payload=b64url(new TextEncoder().encode(JSON.stringify({email,exp:Date.now()+8*60*60*1000})));const signature=await crypto.subtle.sign("HMAC",await hmacKey(secret,["sign"]),new TextEncoder().encode(payload));return payload+"."+b64url(new Uint8Array(signature));}
async function isAdminRequest(request,env){if(!env.ADMIN_EMAIL||!env.ADMIN_SESSION_SECRET||env.ADMIN_SESSION_SECRET.length<32)return false;const match=(request.headers.get("Authorization")||"").match(/^Bearer ([A-Za-z0-9_.-]+)$/);if(!match)return false;const parts=match[1].split(".");if(parts.length!==2)return false;try{const valid=await crypto.subtle.verify("HMAC",await hmacKey(env.ADMIN_SESSION_SECRET,["verify"]),fromB64url(parts[1]),new TextEncoder().encode(parts[0]));if(!valid)return false;const payload=JSON.parse(new TextDecoder().decode(fromB64url(parts[0])));return payload.email===env.ADMIN_EMAIL.trim().toLowerCase()&&Number(payload.exp)>Date.now();}catch{return false;}}
function safeEqual(a,b){const left=new TextEncoder().encode(String(a)),right=new TextEncoder().encode(String(b));let difference=left.length^right.length;for(let i=0;i<Math.max(left.length,right.length);i++)difference|=(left[i]||0)^(right[i]||0);return difference===0;}
function parseYouTubeUrl(value){if(typeof value!=="string"||value.length>500)return null;try{const url=new URL(value.trim());if(url.protocol!=="https:")return null;let id="";if(url.hostname==="youtu.be")id=url.pathname.split("/").filter(Boolean)[0]||"";else if(["youtube.com","www.youtube.com","m.youtube.com","youtube-nocookie.com","www.youtube-nocookie.com"].includes(url.hostname)){if(url.pathname==="/watch")id=url.searchParams.get("v")||"";else if(/^\/(embed|shorts)\/[A-Za-z0-9_-]{11}/.test(url.pathname))id=url.pathname.split("/")[2]||"";}return /^[A-Za-z0-9_-]{11}$/.test(id)?id:null;}catch{return null;}}
function validVideoCoordinates(body){return body&&typeof body.course_id==="string"&&/^[A-Za-z0-9_-]{1,80}$/.test(body.course_id)&&Number.isInteger(body.unit_index)&&body.unit_index>=0&&body.unit_index<=100&&Number.isInteger(body.lesson_index)&&body.lesson_index>=0&&body.lesson_index<=100;}
async function handleAdminLogin(request,env,origin){if(!validApiOrigin(origin))return apiJson({error:{code:"forbidden_origin"}},403,origin);if(request.method!=="POST")return apiJson({error:{code:"method_not_allowed"}},405,origin);if(!env.ADMIN_EMAIL||!env.ADMIN_PASSWORD||!env.ADMIN_SESSION_SECRET||env.ADMIN_SESSION_SECRET.length<32)return apiJson({error:{code:"admin_not_configured"}},503,origin);if(isRateLimited(request,5))return apiJson({error:{code:"rate_limited"}},429,origin);let body;try{body=await request.json();}catch{return apiJson({error:{code:"invalid_request"}},400,origin);}const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";const password=typeof body?.password==="string"?body.password:"";if(!safeEqual(email,env.ADMIN_EMAIL.trim().toLowerCase())||!safeEqual(password,env.ADMIN_PASSWORD))return apiJson({error:{code:"invalid_credentials"}},401,origin);return apiJson({token:await issueAdminToken(email,env.ADMIN_SESSION_SECRET),expires_in:28800},200,origin);}
async function handleLessonVideos(request,env,url,origin){if(!validApiOrigin(origin))return apiJson({error:{code:"forbidden_origin"}},403,origin);if(!env.DATABASE_URL)return apiJson({error:{code:"database_not_configured"}},503,origin);if(isRateLimited(request,MAX_DB_REQUESTS))return apiJson({error:{code:"rate_limited"}},429,origin);try{const sql=neon(env.DATABASE_URL);if(request.method==="GET"){const courseId=url.searchParams.get("course_id");if(courseId&&!/^[A-Za-z0-9_-]{1,80}$/.test(courseId))return apiJson({error:{code:"invalid_request"}},400,origin);const result=courseId?await sql.query("SELECT course_id,unit_index,lesson_index,youtube_url,youtube_video_id,title FROM lesson_videos WHERE course_id=$1 ORDER BY unit_index,lesson_index LIMIT 500",[courseId]):await sql.query("SELECT course_id,unit_index,lesson_index,youtube_url,youtube_video_id,title FROM lesson_videos ORDER BY course_id,unit_index,lesson_index LIMIT 1000");return apiJson({data:result.rows||result},200,origin);}if(!["POST","PUT","DELETE"].includes(request.method))return apiJson({error:{code:"method_not_allowed"}},405,origin);if(!(await isAdminRequest(request,env)))return apiJson({error:{code:"unauthorized"}},401,origin);let body;try{body=await request.json();}catch{return apiJson({error:{code:"invalid_request"}},400,origin);}if(!validVideoCoordinates(body))return apiJson({error:{code:"invalid_request"}},400,origin);const params=[body.course_id,body.unit_index,body.lesson_index];if(request.method==="DELETE"){await sql.query("DELETE FROM lesson_videos WHERE course_id=$1 AND unit_index=$2 AND lesson_index=$3",params);return apiJson({ok:true},200,origin);}const videoId=parseYouTubeUrl(body.youtube_url);const title=typeof body.title==="string"?body.title.trim().slice(0,200):"";if(!videoId)return apiJson({error:{code:"invalid_youtube_url"}},400,origin);const result=await sql.query("INSERT INTO lesson_videos(course_id,unit_index,lesson_index,youtube_url,youtube_video_id,title) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(course_id,unit_index,lesson_index) DO UPDATE SET youtube_url=EXCLUDED.youtube_url,youtube_video_id=EXCLUDED.youtube_video_id,title=EXCLUDED.title,updated_at=now() RETURNING course_id,unit_index,lesson_index,youtube_url,youtube_video_id,title",[...params,body.youtube_url.trim(),videoId,title||null]);return apiJson({data:(result.rows||result)[0]},200,origin);}catch{return apiJson({error:{code:"database_unavailable"}},503,origin);}}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const origin = request.headers.get("Origin") || "";
    if (url.pathname.startsWith("/api/admin/") || url.pathname === "/api/lesson-videos") {
      if (request.method === "OPTIONS") return validApiOrigin(origin)
        ? new Response(null,{status:204,headers:{...API_PUBLIC_HEADERS,"access-control-allow-origin":origin||APP_ORIGIN}})
        : apiJson({error:{code:"forbidden_origin"}},403,origin);
    }
    if (url.pathname === "/api/admin/login") return handleAdminLogin(request,env,origin);
    if (url.pathname === "/api/lesson-videos") return handleLessonVideos(request,env,url,origin);

    if (url.pathname === "/api/health") {
      return request.method === "GET"
        ? json({ ok: true, service: "ahmed-study-ai" })
        : json({ error: { code: "method_not_allowed" } }, 405);
    }

    if (url.pathname.startsWith("/api/db/")) {
      return handleDatabase(request, env, url);
    }

    if (url.pathname === "/api/chat") {
      return handleAI(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: { code: "not_found" } }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
