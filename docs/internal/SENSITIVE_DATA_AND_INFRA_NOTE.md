# Sensitive data handling (operator note)

**Audience:** Operators and trusted engineering. **Companion customer text** lives alongside the Privacy overview, Terms of use, and Security practices pages in the same documentation bundle.

## High-sensitivity categories (conceptual)

Treat the following categories as needing **minimal retention, minimal logging, minimal copy-paste**:

- Structured payout facilitation text typed to help others send money **outside** the app  
- Images that encode **scan-to-pay** style references  
- **Receipt-style** uploads showing transfers  
- Combining **financial-adjacency** with **personal identity** in support threads or stray screenshots  

Product facts engineers must preserve (see published policies for full wording):

1. Actual money movement is user-led outside Beabr’s core logging model.  
2. Reveal and membership behavior is **service-authoritative**, not UI-only hiding.  
3. People who coordinate pooled money may see peers’ proof-of-payment material **inside the product**; support staff must not rebroadcast that material insecurely.

## Controls (non-exhaustive)

- Application-layer encryption for designated facilitator text **when keys are configured**  
- Non-public, access-controlled storage for pledge-related images; short-lived access patterns where practical  
- Deny public object ACLs by default  
- Logs that **avoid** raw account numbers, full receipt paths, or long-lived access tokens in shared aggregators  
- Secrets only in orchestration stores, never committed to source control  
- Deletion flows that remove linked files when registries are removed, subject to eventual consistency limits stated legally  

## Incidents

Suspected bulk leakage of payout or receipt material, or widespread session theft, triggers the operator’s incident process and legal review thresholds.

## Support

Do not ask users to email full account credentials. Prefer guided flows inside the product after policy review.

---

*Customer-facing disclosures remain the authoritative member text; this note is operational.*
