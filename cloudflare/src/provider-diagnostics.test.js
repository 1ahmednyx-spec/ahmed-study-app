import test from "node:test";
import assert from "node:assert/strict";
import { getProviderDiagnostics } from "./provider-diagnostics.js";

test("returns HTTP status and a validated provider status code only", async () => {
  const response = new Response(JSON.stringify({
    error: {
      code: 400,
      status: "INVALID_ARGUMENT",
      message: "Sensitive provider detail must not be returned"
    }
  }), { status: 400 });
  const diagnostics = await getProviderDiagnostics(response);
  assert.deepEqual(diagnostics, {
    provider_status: 400,
    provider_code: "INVALID_ARGUMENT"
  });
  assert.equal("message" in diagnostics, false);
});

test("omits malformed or unsafe provider codes", async () => {
  const response = new Response(JSON.stringify({
    error: { status: "INVALID CODE; SECRET=abc" }
  }), { status: 403 });
  assert.deepEqual(await getProviderDiagnostics(response), {
    provider_status: 403
  });
});

test("retains the HTTP status when the provider body is not JSON", async () => {
  const response = new Response("not-json", { status: 502 });
  assert.deepEqual(await getProviderDiagnostics(response), {
    provider_status: 502
  });
});
