# Security practices (overview)

This page summarizes how Beabr deployments are approached for safety and confidentiality. **Detailed engineering evidence, configuration checklists, and remediation history are kept in private developer materials**, not in customer-facing pages.

---

## Authentication

- Members sign in with the methods the developer enabled for this instance, such as **Google** or **email plus a one time code**. Beabr does **not** use a traditional reusable password for the common one time code path; sessions follow the hosting identity product’s normal session behavior.  
- Actions that change sensitive data require a **valid signed-in session**. If account setup does not complete during sign-in, you may see a temporary **unavailable** message rather than partial access that could confuse permissions.  

---

## Application and transport security

- Responses use **standard HTTP hardening** appropriate for a JSON-focused application.  
- **Share links** for registries use a **configured public site address** so host-name tricks are less likely to misroute people.  
- **Rate limiting** reduces abusive traffic on join and general use.  
- **Production errors** are written to avoid leaking raw internal diagnostics to browsers; developers still see deeper detail in protected logs where needed.  

---

## Data at rest (high-impact areas)

- Certain **pooled pledge facilitator text** can be stored **encrypted** when developers supply the required key material.  
- **Scan-to-pay style reference images** for pledges are stored in a **non-public, access-controlled** way and are shown only through authenticated flows allowed for the right registry members.  

Other stored content may be classified more loosely; developers maintain internal data-classification notes.

---

## Stored data access model

Access from the open web is expected to follow **least privilege**. Administrative credentials used for maintenance must never be embedded in browsers or public builds.

---

## Uploads

Upload routes enforce **size limits** aligned across the application and storage layer. Avatar images use a smaller limit than richer media where that distinction exists.

---

## Developer responsibilities

The developer responsible for this Beabr instance is responsible for:

- Rotating **service credentials** and **signing secrets** when policy or suspicion requires  
- Turning on **hosted identity** safeguards that match your roadmap (for example breached-password hints if you add passwords later)  
- Setting the **canonical public URL** and **trusted proxy** options correctly behind load balancers  
- Network boundaries, backups, monitoring, and physical access hygiene  

Routine dependency review and penetration testing posture are part of mature operations even when not enumerated here.

---

## Report a security concern

You may contact **keith_tagarao01@yahoo.com.ph** if you believe you found a security issue.

Include:

- What you were trying to do  
- What happened instead  
- The steps to reproduce it  
- Screenshots if they help  
- The approximate time you saw it  

We track fixes in internal engineering notes so the right people can resolve the issue quickly.

For a simplier guide to reporting, safety expectations, and role-based protections, read **[User protection](user-protection.md)**.

---

_End of Security practices_
