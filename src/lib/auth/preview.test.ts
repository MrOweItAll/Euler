import assert from "node:assert/strict";
import test from "node:test";
import { resolveGrokOAuthCredentials } from "./preview.ts";

test("explicitly disabled auth does not need OAuth credentials", () => {
  assert.deepEqual(resolveGrokOAuthCredentials({ VITE_AUTH_ENABLED: "false" }), {
    enabled: false,
    clientId: undefined,
    clientSecret: undefined,
  });
});

test("enabled auth requires both injected credentials", () => {
  for (const environment of [
    {},
    { VITE_AUTH_ENABLED: "true" },
    { GROK_AUTH_CLIENT_ID: "test-client" },
    { GROK_AUTH_CLIENT_SECRET: "test-only-secret" },
    { GROK_AUTH_CLIENT_ID: "test-client", GROK_AUTH_CLIENT_SECRET: " " },
  ]) {
    assert.throws(() => resolveGrokOAuthCredentials(environment), /not both configured/);
  }
});

test("configured auth uses injected credentials without a tracked fallback", () => {
  assert.deepEqual(
    resolveGrokOAuthCredentials({
      GROK_AUTH_CLIENT_ID: " test-client ",
      GROK_AUTH_CLIENT_SECRET: " test-only-secret ",
    }),
    {
      enabled: true,
      clientId: "test-client",
      clientSecret: "test-only-secret",
    },
  );
});
