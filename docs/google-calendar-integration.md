# Google Calendar integration handoff

Production integration is intentionally disabled. Mock mode is the only supported local mode.

## Required setup

1. Create a dedicated Google Cloud project and OAuth client.
2. Use least-privilege Calendar scopes: `calendar.freebusy` for availability and `calendar.events` only for approved event creation.
3. Store client ID, client secret, refresh token, and calendar ID in the deployment platform's encrypted secret store—never source control or browser variables.
4. Define who manually approves requests and how holds/conflicts expire.
5. After approval, create the event with Google Meet conference data and send acknowledgement/confirmation through the selected email provider.
6. Add provider rate limits, honeypot monitoring, audit logs, retries, and conflict checks.

## Retest

Test free/busy boundaries, timezone/DST handling, concurrent slot requests, rejected requests, manual approval, Meet creation, email failures, revoked OAuth, rate limits, and confirmation wording. Verify no credential or private calendar details reach the browser or logs.
