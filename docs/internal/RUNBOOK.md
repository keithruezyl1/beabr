# Operations runbook (draft)

**Audience:** Internal operators. **Not** customer facing.

## 1. Environments

For each environment, record privately:

- API base URL  
- Web base URL  
- Where primary records live  
- Where uploaded files live  

Use your password manager or secure wiki; do not paste live secrets into this file.

## 2. Secrets and access

- Never commit environment files that contain production keys.  
- Rotate **hosting credentials** and **signing secrets** on suspicion of leak.  
- Require MFA on vendor accounts that can access production.  

## 3. Deploy checklist (typical)

1. Take or confirm backups when schema changes are risky.  
2. Apply data migrations using your approved pipeline.  
3. Deploy the application service; smoke-test health if you expose it.  
4. Deploy the web client; clear caches if a CDN sits in front.  
5. Smoke-test: sign-in, open a registry, exercise a sensitive read path (for example pledge media) with a non-production account when possible.  

## 4. Rollback

Keep prior release artifacts runnable within your recovery targets. Data changes are often **forward-only**; design migrations or feature flags accordingly.

## 5. Sensitive incident triggers

Elevate severity if you suspect exposure of **pooled pledge payout content** or **large-scale receipt imagery** outside intended access.

## 6. Logs

Operational logging should avoid echoing full payout strings or durable access links into multi-tenant aggregators without a redaction policy.

## 7. Backups

Exercise restore drills on a schedule you can defend; align backup retention with what you tell members in privacy materials.

---

Expand with provider-specific steps in private operator notes.
