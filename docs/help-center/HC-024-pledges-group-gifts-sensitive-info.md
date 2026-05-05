# Group pledges and sensitive payout information

**Article ID:** HC-024  
**Audiences:** Pledge Initiators; Registry Participants; Registry Owners (context)  
**Risk notice:** Read this article **before** you enter bank or e wallet details, scan QR payloads, or upload receipt photos inside Beabr.

Beabr allows **eligible Registry Participants** (usually **not** the **Registry Owner**) to coordinate **group money** toward a registry gift item **when that coordination is enabled for you**. This article explains **roles**, **privacy**, **fraud avoidance**, **what gets stored**, and **what Beabr is not**.

For what Beabr is responsible for when misuse occurs, read **[Beabr’s responsibility](../legal/beabr-responsibility.md)**.

---

## 1. Roles in plain words

### Pledge Initiator

One **Registry Participant** (**per eligible gift item**, in typical rules) starts the pooled pledge. They enter **payout method** information (bank, e wallet labeled “GCash-like,” or “other”), optional **beneficiary or account references**, institution text, explanatory notes for how others should pay **outside Beabr**, and may upload **QR code imagery** recipients might scan elsewhere.

Disclosures affecting **Pledge Initiators** appear in **[Terms of use](../legal/terms-of-service.md)** (gift coordination and pooled flows).

### Registry Participants adding amounts

Other **Registry Participants** record **amount intents** toward that pool, transfer money **outside** Beabr according to cues and their own diligence, and optionally upload **receipt imagery** evidencing transfers. The **Pledge Initiator** may see contribution summaries and receipts per product workflows for coordination.

See **[Terms of use](../legal/terms-of-service.md)** (**Registry Participants**: minimize uploads, verify payouts).

### Registry Owner

The **Registry Owner** configures the registry and timing. **Default technical rules** reserve pledge initiation flows for **Registry Participant** roles (**not** **Registry Owners**). **Registry Owner** visibility of **who** chipped in aligns with reveal rules. You may see pooled progress metrics earlier depending on configurations.

Always trust your live UI and authoritative legal disclosures over any example.

---

## 2. Beabr is NOT moving your money

**Critical:** Logging amounts, instructions, QR images, or receipt photos inside Beabr does **not** mean Beabr has:

- Debited or credited a bank ledger  
- Held funds in escrow  
- Guaranteed authenticity of every screenshot  
- Insured mistaken transfers  

You must treat every instruction as potentially wrong, forged, phishing-driven, typo-prone, or malicious, even if it sits next to someone you socially trust online.

Transfers happen in **banks, regulated e money apps (where you use them), remittance corridors, OTC cash**, and similar. Those channels have their **own protections, fees, irrevocability quirks, AML holds, reversal windows** that Beabr documentation cannot exhaustively map.

Consumer protection statutes may still impose duties on **actual payment providers**, not necessarily on auxiliary coordination SaaS documenting gifts. Consult regulators if unsure.

---

## 3. What categories of sensitive data might appear?

Examples (non-exhaustive):

- **Structured fields** resembling account numbers, wallet handles, names on accounts, bank names  
- **QR images** embedding payment payloads (risk: wrong amount tags, pasted malicious redirects in exotic abuse, not classic Beabr feature, but attack creativity grows)  
- **Receipt JPG or PNG uploads** inadvertently capturing **government IDs**, full card PAN plus CVV, street addresses alongside transaction lines, children’s incidental appearance, employer confidential headers  

**Assume compromise impact is catastrophic** if such files leak, even though developers implement infrastructure safeguards described in **[Security practices](../legal/security-practices.md)** plus **[Privacy overview](../legal/privacy-policy.md)**.

Users must adopt **privacy minimization** aggressively.

**Screenshot warning:** Treat payout details, QR codes, and receipts as **highly sensitive**. Avoid taking screenshots or screen recordings, and never share them in group chats or on social media. Prefer **copy/paste** and **cropped** receipts that show only the minimum necessary details.

---

## 4. Fraud and social engineering playbook (Registry Participant diligence)

Attackers imitate registries similar to ticketing scams, only faster emotional hook (“graduation goodwill”).

Mitigations checklist **before transferring external funds**:

1. **Cross-check identity** using a **separate channel you already trust** (voice or video with someone you independently know, not only text).  
2. **Compare initials** and typed names against longstanding prior knowledge, not only plausible display names that impersonation might reuse after sign-in quirks.  
3. **Treat urgent pay now pressure** skeptically. Even genuine graduation crunch rarely justifies irrevocable RTP without a verification pause.  
4. **Fingerprint QR origin**: attackers might swap screenshots in group chats upstream of **Pledge Initiator** legitimacy. Prefer scanning only from tightly controlled initiation surfaces after verifying **Pledge Initiator** takeover is not plausible.  
5. **Typing details manually** versus scanning when unsure. Sometimes slower is safer paired with beneficiary name checks on banking portals.  
6. **Rounded test micro-transfers then remainder** rarely works everywhere. Banks differ. The idea is sometimes valid though operationally clumsy. Some rails forbid fragmentation. **Consult your bank UX**.  

If defrauded, contact **your bank fraud desk** urgently. Preservation of device logs aids police reporting where applicable. Beabr may assist law enforcement pursuant to lawful process but **cannot** reverse bank transfers from inside this product.

---

## 5. For Pledge Initiators specifically

Your duties include:

- Once you start a pooled pledge, it **cannot be cancelled** in Beabr. Start it only if you are prepared to follow through with coordination. If plans change, resolve it with your contributors **outside the app** (for example by message) and do not rely on a future “undo” feature.
- Publishing **truthful payable instructions for accounts you are authorized** to use. No impersonation hijacking another person’s payout identity.  
- **Correct numeric and label accuracy**. Typographical divergence misroutes irrevocable pushes. You rectify quickly and visibly.  
- **Guarding receipts** collaborators upload. Those images can include **financial intelligence** attackers want. Do not re-post publicly in social media flex threads.  
- **AML, tax, crowdfunding** overlays may apply unexpectedly at volume. Lawyer or accountant when thresholds climb.  

Misroutes due to **your** wrong digits are not Beabr malfunction.

---

## 6. For Registry Participants adding amounts specifically

Best practices uploading **proof of payment**:

- **Crop** to minimum necessary. The payee or ref line plus amount and time often suffices absent regulator-specific demands, not entire lockscreen selfies.  
- **Redact** unrelated names, barcode membership numbers, psychiatric medication charge lines unintentionally adjoining transaction rows in multi-line receipts (**example pattern** illustrating minimization, not medical advice channel).  
- **Never embed** OTP codes or RSA token codes accidentally if screenshot spans SMS overlay.  
- **Authentic uploads only**: forged proofs may trigger criminal consequences beyond account bans. **Honesty**.

You cannot pledge then reverse via Beabr magically. Banks handle disputes.

Also: **confirm Pledge Initiator legitimacy** **before** large transfers. Guilt-based social pressure is coercive control pattern.

---

## 7. Storage and visibility (high level)

Beabr retains pledge initiation and contribution records needed to run pooled flows, along with **protected file storage** for QR and receipt images. Access is limited to **eligible members** through the product’s normal screens.

**Pledge Initiators** often can see **who contributed** and **receipt material** for reconciliation. This is feature intended but **high stakes**: legal terms warn you.

**Registry Owners** gain insight consistent with **reveal** policy. See **[Privacy before and after reveal](HC-030-privacy-reveal-summary.md)**.

---

## 8. Liability anchors

Disclaimers, liability limits, and non waiver clauses live in **[Terms of use](../legal/terms-of-service.md)** together with **[Privacy overview](../legal/privacy-policy.md)**. This help center article restates hazards only operationally. It does not supersede authored policy pages.

---

## 9. If you feel unsafe

Coercive gift demands, domestic financial abuse via registries, minors pressured to upload parents’ bank tokens: **pause**, contact local support organizations, law enforcement if threats exist. Beabr cannot replace emergency services.

---

## 10. Related articles

- [Pledge rules for gift items](HC-025-pledge-rules.md)  
- [Cash funds and registry money goals](HC-013-cash-funds.md)  
- [Pledge and total visibility](HC-031-pledge-visibility.md)  
- [Privacy before and after reveal](HC-030-privacy-reveal-summary.md)

## Policy pages

- **[Terms of use](../legal/terms-of-service.md)**  
- **[Privacy overview](../legal/privacy-policy.md)**  
- **[Security practices](../legal/security-practices.md)**
