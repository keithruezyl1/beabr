# Pledge rules for gift items

**Article ID:** HC-025  
**Audience:** Registry Participants; Pledge Initiators; Registry Owners (context)

This article defines the product rules for **item-level pooled pledges** (group pledges) where your Beabr instance enables them.

---

## 1. Key terms

### Pooled pledge (group pledge) on an item

A **pooled pledge** is an item-level group contribution workflow. One Registry Participant becomes the **Pledge Initiator** for that item, posts payout instructions, and other Registry Participants contribute amounts toward the pool.

Important context:

- Beabr does **not** move money in the baseline product. Payouts happen **outside** Beabr (bank transfer, e wallet, cash, etc.).  
- Because payout cues and receipts can be sensitive, read **[Group pledges and sensitive payout information](HC-024-pledges-group-gifts-sensitive-info.md)** before using this feature.
- Attribution follows the registry's setup-time visibility mode. **Open coordination** can show who initiated or contributed earlier; **private surprise** keeps owner attribution protected until reveal.

---

## 2. Core pledge rules (item-level)

### Rule A — Pledge initiation blocks reservations on that item

If an item has a pooled pledge **initiated**:

- Other Registry Participants **cannot reserve** that item.
- Their only option for participating on that item is to **contribute to the pledge** (if they want to help).

This prevents mixed coordination paths (one person “buying it” while others are “pooling money”) from creating confusion and double-coverage.

### Rule B — You may contribute any amount

When contributing to a pooled pledge:

- You may contribute **any amount** you choose.
- The product may allow multiple contributions over time; follow what your live UI supports.

### Rule C — A started pledge cannot be cancelled

Once a pooled pledge is started, it **cannot be cancelled** in Beabr. Owners also cannot archive that gift item after pledge initiation, because the item now carries active coordination history.

- Start a pledge only if you intend to follow through with coordination.
- If plans change, resolve the situation with contributors **outside the app** (for example by messaging) and do not rely on a future “undo” feature.

### Rule D — Pledge Initiator responsibility

The Pledge Initiator is responsible for fulfilling the pledge they initiated by:

- Keeping payout instructions **accurate** (and promptly correcting mistakes)
- Coordinating reconciliation (for example reviewing contributions/receipts where your build supports it)
- Closing the loop with contributors through normal channels if anything changes

For safety expectations and role duties, see **[User protection](../legal/user-protection.md)**.

---

## 3. How this differs from cash funds

Item-level pooled pledges attach to a **specific gift line item**. Cash funds are separate “money goal” sections not tied to one item.

See **[Cash funds and registry money goals](HC-013-cash-funds.md)** for the cash-fund model.

---

## 4. Related articles

- [Add and organize gift items](HC-010-gift-items.md)  
- [Reserve and prepare a gift item](HC-021-reserve-and-prepare.md)  
- [Group pledges and sensitive payout information](HC-024-pledges-group-gifts-sensitive-info.md)  
- [Pledge and total visibility](HC-031-pledge-visibility.md)
