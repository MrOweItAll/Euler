/**
 * Server-only OAuth configuration. Credentials must be injected by the host for
 * previews and deployed apps; never ship a shared client secret in source.
 */
export function resolveGrokOAuthCredentials(environment: Record<string, string | undefined>) {
  const enabled = environment.VITE_AUTH_ENABLED?.trim() !== "false";
  const clientId = environment.GROK_AUTH_CLIENT_ID?.trim() || undefined;
  const clientSecret = environment.GROK_AUTH_CLIENT_SECRET?.trim() || undefined;
  if (enabled && (!clientId || !clientSecret)) {
    throw new Error(
      "Auth is enabled but GROK_AUTH_CLIENT_ID and GROK_AUTH_CLIENT_SECRET " +
        "are not both configured. Inject server-side credentials before enabling sign-in.",
    );
  }
  return { enabled, clientId, clientSecret };
}

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns whose callbacks the preview client accepts. Better Auth derives
 * the live preview's real origin from the request host and validates it against
 * this list (wildcard-matched), so the OAuth `redirect_uri` becomes the concrete
 * `https://<preview-host>/api/auth/oauth2/callback/...` the broker allows.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
