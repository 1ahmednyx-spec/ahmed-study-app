const SAFE_PROVIDER_CODE = /^[A-Z][A-Z0-9_]{0,63}$/;

export async function getProviderDiagnostics(response) {
  let payload = null;
  try {
    payload = await response.clone().json();
  } catch {
    // A non-JSON provider response still has a useful HTTP status.
  }

  const rawCode = payload?.error?.status;
  const diagnostics = { provider_status: response.status };
  if (typeof rawCode === "string" && SAFE_PROVIDER_CODE.test(rawCode)) {
    diagnostics.provider_code = rawCode;
  }
  return diagnostics;
}
