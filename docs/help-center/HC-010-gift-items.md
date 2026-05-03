# Add and organize gift items

**Article ID:** HC-010  
**Audience:** Registry Owners

Gift items are the backbone of most registries. Each item describes something **Registry Participants** might prepare or buy, and how **quantity** and **availability** work over time.

---

## What goes into an item

Depending on categories and product version, you can usually include fields such as:

- **Title** and **category**  
- **Description** and instructions for **Registry Participants**  
- **Quantity needed** (how many slots or units)  
- **Price reference** (helpful hints, not a checkout total in the baseline product)  
- **Store**, **external link**, **preferred option**, **alternatives**  
- **Photos**  

Category-specific attributes (like size or color) may appear as flexible fields.

---

## How availability works

For each item, Beabr tracks how much is:

- **Reserved** (quantity still in “reserved” status)  
- **Prepared** (quantity marked prepared)  
- **Claimed** (reserved plus prepared)  
- **Available** (quantity still open to reserve, which is quantity needed minus claimed)

**Registry Participants** cannot over-reserve beyond what remains available. The running product enforces that. If reservations or pooled pledge flows block changes, resolve those first before archiving tricky items. Your app may warn you when archiving is blocked while activity exists.

### Status labels **Registry Participants** see on gift cards

The product maps those counts to **exactly five** status labels on participant-facing gift cards, in this evaluation order:

1. **Available** — no quantity is reserved or prepared yet.  
2. **Prepared** — prepared quantity meets or covers **quantity needed** (every unit is prepared).  
3. **Partially Prepared** — at least one unit is prepared, but prepared quantity does not yet cover **quantity needed**.  
4. **Reserved** — nothing is prepared yet, and reserved quantity meets or covers **quantity needed** (every unit is reserved, none prepared yet).  
5. **Partially Reserved** — nothing is prepared yet, some quantity is reserved, but reserved quantity does not yet cover **quantity needed**.

There is no separate **Closed** quantity status label from this logic: when nothing is left to reserve, the card shows **Reserved**, **Partially Prepared**, or **Prepared** depending on how many units are still only reserved versus prepared.

### What **Registry Owners** see

Owner views emphasize the **numeric** breakdown (reserved, prepared, available) rather than the participant status pill on each card. Use those numbers together with any labels your screen shows for accessibility; do not rely on color alone.

---

## Archiving items

You can archive items you no longer want listed. Archived items typically drop from the main gift list depending on filtering.

---

## Group pledges on an item

For some gifts, **Registry Participants** may coordinate **pooled contributions** alongside or instead of a single purchaser. That involves **information related to external payments**, initiated by **Registry Participants**, not by you as the **Registry Owner** in typical flows, and settlements **outside** banks as you arrange them.  

Read **[Group pledges and sensitive payout information](HC-024-pledges-group-gifts-sensitive-info.md)** before inviting people to use that path.

---

## Related articles

- [Share your registry](HC-011-share-registry.md)  
- [Reserve a gift](HC-021-reserve-gift.md)  
- [Mark a gift as prepared](HC-022-mark-prepared.md)
