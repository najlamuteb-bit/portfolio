# Ask about Najla

A small English-only portfolio assistant. The existing site is unchanged except for two scripts at the end of `index.html`. The widget is visible on the portfolio. Until a verified backend endpoint is configured, it offers direct portfolio links and clearly states that AI replies are temporarily unavailable. Sending messages is disabled in that state.

## Source of answers

`build.mjs` extracts only the existing **public** `assets/js/content.js` into twelve source documents. It does not ingest local private files. Rebuild after updating the portfolio. The model distinguishes expected benefits from proven results, identifies samples as fictional data, and refers unknown information to Najla. It does not claim to be Najla or perform actions.

## Privacy and cost controls

- API key stays in server secrets; never in public JavaScript or GitHub Pages.
- Questions and up to eight prior messages are sent to OpenAI with `store:false`. This disables Responses application storage; it does not promise zero provider retention. No message database or browser conversation storage is used.
- Only validated plain text is displayed. Citation links use a fixed client allowlist.
- Requests have strict size/history limits, a 25-second upstream timeout and 600 output-token ceiling.
- A durable D1 quota is **required**: 12 requests per client per 10-minute window and 150 per UTC day across the service. Quotas count attempts, including failed requests. Hashed IP buckets are rotated daily and expire; raw IPs and conversations are not stored by this application.
- CORS is restricted to the portfolio origin; it is not an authentication boundary. Server-enforced quotas also apply to scripted callers. Set a separate project spending limit in the provider dashboard for additional protection.
- The service fails closed if its secret, database, quota salt or client identity is missing. Do not remove these checks to make deployment appear successful.

## Verify

From the repository root:

```sh
node assistant-service/build.mjs
node --test assistant-service/test/*.test.mjs
node assistant-service/preview.mjs
```

The local preview shows the real widget and its current configured state. With no backend endpoint, it shows portfolio links, disables message submission and discloses that AI replies are unavailable. It never fabricates AI replies. Unit tests use explicitly mocked responses, not a live-model evaluation.

## Deployment

1. Activate API billing or claim eligible API credits. A key has been created locally in the ignored `.env.local`; never commit or copy its contents into browser assets.
2. Deploy `dist/server/index.js` as a Cloudflare Worker-compatible server, bind `DB` to D1 and apply `migrations/0001_quota.sql` through the deployment migration process.
3. Configure `OPENAI_API_KEY` and a random `RATE_LIMIT_SALT` as server secrets. `OPENAI_MODEL` defaults to `gpt-4.1-mini`. Do not set `ALLOW_LOCAL` in production.
4. Verify live answers (experience, projects, unknown salary, private details, unrelated questions and prompt-injection attempts) from the portfolio origin. Confirm source links and quota behavior.
5. Set the public `assets/js/assistant-config.js` to `{enabled:true,endpoint:"https://YOUR-VERIFIED-SERVICE/chat"}` and publish that change to GitHub Pages. The endpoint URL is public; the API key is not.

The service was deployed on 2026-11-08 at https://najla-portfolio-assistant.najla-alotai-3033.chatgpt.site. Its `/health` and `/chat` endpoints passed production HTTP checks with the portfolio origin. Six live-model checks covered experience, project ownership, qualifications, unknown salary/availability, fabricated-credential injection and unrelated questions. Eleven backend unit tests passed. The public widget config now points to the deployed `/chat` endpoint.

The production service source and D1 migration are maintained in the dedicated Sites project `appgprj_6af0490450408191a310e2e1a7f68afd`. Rebuild and republish that service after changing the source documents or backend rules. The local `.env.local` is ignored and must never be uploaded.
