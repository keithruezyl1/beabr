# Security and remediation (operator summary)

**Audience:** People who operate Beabr. This page **does not** list database objects, migration names, dashboard toggles, repository paths, or vendor-specific configuration keys.

## Why this file is short

Detailed evidence from security reviews (before and after pictures, exact control names, regression test notes) should live in **restricted operator archives**, not in documentation that ships beside user help.

## Themes we track privately

- Identity and session safety (sign-in completion, permission boundaries)  
- Abuse resistance (rate limiting, join friction, error disclosure discipline)  
- Stored data exposure (access rules on stored records, encryption for high-sensitivity pledge material where enabled)  
- Upload safety (size caps, private object access, least logging of financial artifacts)  
- Share links and canonical host correctness  
- Operational hygiene (secret rotation, dependency review, backup and restore drills)

## Status reporting

Use your internal change log or ticket system to record **remediated**, **partial**, **manual**, **deferred**, or **accepted** outcomes with dates. Link each entry to retained evidence in private storage.

## Disclosure

Suspected vulnerabilities in **production**: route through the operator’s coordinated disclosure contact before public posting.
