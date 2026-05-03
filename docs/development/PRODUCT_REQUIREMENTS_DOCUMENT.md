# Product Requirements Document
# Beabr — Prepare Smarter Gifts

## 1. Product Overview

Beabr is a web-based graduation gift-preparation registry app that allows graduates to create a private registry, share access through a code or link, and let invited gift givers reserve, prepare, or pledge gifts without revealing their identities until a scheduled reveal date.

The app is not a social network. It should feel modern, premium, and easy to use like a polished social media app, but its purpose is functional: gift logging, preparation tracking, and reveal coordination.

---

## 2. Product Name

**Beabr**

## 3. Tagline

**Prepare Smarter Gifts**

---

## 4. Product Purpose

Graduates often receive duplicate, mismatched, or unwanted gifts because friends and family have no centralized way to coordinate what has already been prepared.

Beabr solves this by allowing the graduate to create a registry of desired gifts and allowing gift givers to privately claim, prepare, or pledge toward items.

The owner can set a date and time when everything is revealed, including who gave what and how much each person pledged.

---

## 5. Target Users

### 5.1 Registry Owner

A graduating person who wants to organize desired gifts and avoid duplicates.

### 5.2 Registry Viewer / Gift Giver

A friend, family member, classmate, relative, or supporter who wants to prepare a gift for the graduate.

---

## 6. Core Product Goals

1. Help graduates clearly list desired gifts.
2. Help gift givers avoid duplicate gifts.
3. Preserve the surprise until the scheduled reveal.
4. Support both physical gifts and manual money pledges.
5. Provide a premium, modern, mobile-first experience.
6. Keep the early iteration simple enough for one-shot development.

---

## 7. Early iteration scope

This early iteration must include:

- Google OAuth authentication
- Registry creation
- Registry access through code and shareable link
- Registry profile page
- Owner item management
- Category-based item fields
- Gift item reservation
- Gift item preparation confirmation
- Quantity support
- Manual money pledge support
- Scheduled reveal date and time
- Post-reveal contributor visibility
- Post-reveal thank-you letters
- In-app thank-you message pop-up for gift givers
- Owner and viewer role permissions
- Mobile-first responsive design

---

## 8. Out of scope for early iteration

This early iteration must not include:

- Real payment processing
- GCash integration
- Bank transfer integration
- Chat or messaging between users
- Social feed
- Likes, comments, follows, reactions, or public profiles
- Public registry discovery
- AI recommendations
- Email notifications
- Push notifications
- Direct product checkout
- Shipping integration
- Multiple registries per owner
- Admin dashboard

GCash and bank connection may be planned for a future version, but the early iteration only supports manual pledge logging.

---

## 9. User Roles and Permissions

## 9.1 Registry Owner

The registry owner can:

- Create a registry
- Edit registry details
- Set graduation date
- Set reveal date and time
- Add, edit, archive, and reorder registry items
- Add cash pledge funds
- View gift preparation progress
- View pledge totals, depending on privacy setting
- Reveal contributor details after reveal date/time
- Write thank-you letters after reveal
- See thank-you message status

The registry owner cannot see who reserved, prepared, or pledged before the reveal date/time.

---

## 9.2 Registry Viewer / Gift Giver

A registry viewer can:

- Log in using Google OAuth
- Join a registry using a code or link
- View available registry items
- Reserve an item
- Mark an item as prepared
- Pledge a money amount manually
- Add a private preparation note
- View whether an item is available, partially reserved, fully reserved, partially prepared, or fully prepared
- View thank-you letters sent to them after reveal

A registry viewer cannot:

- Edit registry details
- Add or edit owner-created items
- See other gift givers before reveal
- See who prepared a gift before reveal
- See private owner-only notes
- Access registries they have not joined

---

## 10. Authentication Requirements

## 10.1 Login Method

This early iteration must use:

- Google OAuth

## 10.2 User Account Data

The app must store:

- User ID
- Google ID
- Name
- Email
- Profile image, if available
- Created timestamp
- Last login timestamp

---

## 11. Registry Creation Requirements

The owner must be able to create a registry with:

- Registry title
- Owner display name
- Short message or note
- Graduation date
- Reveal date and time
- Optional cover image
- Generated registry code
- Generated shareable link

---

## 12. Registry Access Requirements

A registry can be joined by:

1. Entering the registry code
2. Opening a shareable registry link

When a logged-in user joins a registry, they are added as a viewer/member.

The app must prevent unauthorized access to private registry data.

---

## 13. Registry Profile Requirements

Each registry must have a profile page containing:

- Graduate name
- Registry title
- Graduation date
- Short message
- Registry status
- Progress indicator
- Item list
- Cash pledge funds, if any

Example profile message:

> Thank you for celebrating this milestone with me. Here are some things that would help me prepare for my next chapter.

---

## 14. Item Management Requirements

Registry owners can create physical gift items.

Each item must support:

- Title
- Category
- Description
- Quantity needed
- Quantity reserved
- Quantity prepared
- Product link
- Store name
- Price reference
- Brand
- Size
- Color
- Model/specification fields
- Preferred option
- Acceptable alternatives
- Owner note
- Viewer instruction
- Image URL
- Owner intent status
- Item lifecycle status
- Created timestamp
- Updated timestamp
- Archived timestamp

---

## 15. Owner Intent Status

The owner must be able to classify items as:

| Status | Meaning |
|---|---|
| Confirmed | The owner definitely wants this item |
| Considering | The owner is unsure but interested |
| Removed | The owner changed their mind |

By default, viewers should only see confirmed items.

Considering items may be shown only if the owner enables them.

Removed items should be hidden from viewers and treated as archived.

---

## 16. Item Lifecycle Status

Each item must support this lifecycle:

| Status | Meaning |
|---|---|
| Available | No one has reserved or prepared the item |
| Reserved | A viewer intends to prepare it |
| Partially Reserved | Some quantity has been reserved |
| Prepared | The item has been fully prepared |
| Partially Prepared | Some quantity has been prepared |
| Closed | The item is no longer available |

The app must calculate item lifecycle status from reservations and prepared quantities.

---

## 17. Reservation Requirements

A viewer must be able to reserve an item before preparing it.

Reservation means:

- The viewer intends to prepare the item
- Other viewers should see that some or all quantity is no longer available
- The owner still cannot see who reserved it before reveal

Reservation fields:

- Reservation ID
- Registry ID
- Item ID
- Viewer user ID
- Quantity reserved
- Status
- Private viewer note
- Created timestamp
- Updated timestamp

Reservation statuses:

- Reserved
- Prepared
- Cancelled

---

## 18. Preparation Requirements

A viewer can mark a reserved item as prepared.

Prepared means:

- The viewer has bought, created, or otherwise prepared the gift
- The item count updates
- The item may become fully fulfilled if the required quantity is met

The app must prevent viewers from preparing more than the remaining available quantity.

---

## 19. Quantity Requirements

Items must support quantity-based claiming.

Example:

- Item: Towels
- Quantity needed: 4
- Viewer A reserves 2
- Viewer B reserves 1
- Available quantity: 1

The item should show:

- 3 of 4 reserved
- or 3 of 4 prepared, depending on status

---

## 20. Duplicate Prevention Requirements

The app must prevent accidental duplicates by showing clear status labels:

- Available
- Reserved
- Partially reserved
- Prepared
- Partially prepared
- Fully prepared

When an item is already fully reserved or prepared, another viewer should not be able to reserve it unless the owner increases quantity.

---

## 21. Cash Fund / Money Pledge Requirements

This early iteration does not process payments.

It only allows manual pledge tracking.

The owner can add a cash fund with:

- Fund title
- Description
- Optional target amount
- Optional instructions

Examples:

- Dorm Setup Fund
- Laptop Fund
- Graduation Celebration Fund
- Board Exam Review Fund

A viewer can pledge:

- Amount
- Optional private note

Before reveal:

- Owner may see total pledged amount if enabled
- Owner cannot see who pledged

After reveal:

- Owner sees giver name
- Amount pledged
- Optional note

---

## 22. Future Payment Integration Placeholder

The product should reserve future support for:

- GCash
- Bank transfer instructions
- Payment proof upload
- Payment status verification
- Online payment integrations

These must not be implemented in the early iteration.

---

## 23. Reveal System Requirements

The owner must set a reveal date and time.

Before reveal:

- Giver identities are hidden from the owner
- Gift assignments are hidden from the owner
- Pledge contributor details are hidden from the owner

After reveal:

The owner can see:

- Who reserved each item
- Who prepared each item
- Who pledged money
- How much each person pledged
- Viewer notes, if applicable

---

## 24. Reveal Date and Time Rules

The reveal date/time must be required during registry setup.

The owner may edit the reveal date/time before it occurs.

After reveal has occurred:

- The reveal state becomes locked
- Contributor information becomes visible to the owner
- Thank-you letter feature becomes available

---

## 25. Reveal Visibility Rules

Before reveal:

| Data | Owner View |
|---|---|
| Item available status | Visible |
| Item reserved/prepared status | Visible |
| Giver identity | Hidden |
| Money pledge total | Optional |
| Individual pledge amount | Hidden |
| Viewer notes | Hidden |

After reveal:

| Data | Owner View |
|---|---|
| Giver identity | Visible |
| Prepared items | Visible |
| Pledge amount | Visible |
| Viewer notes | Visible |
| Thank-you letter option | Visible |

---

## 26. Thank You Letter Requirements

After reveal, the registry owner can write thank-you letters to gift givers.

The owner can send a thank-you letter for:

- A prepared item
- A money pledge

Each thank-you letter must be tied to:

- Registry
- Owner
- Giver
- Item or cash pledge
- Message body
- Status
- Created timestamp
- Seen timestamp

---

## 27. Thank You Letter States

| Status | Meaning |
|---|---|
| Draft | Owner started but has not sent it |
| Sent | Message is available to giver |
| Seen | Giver has viewed the message |

---

## 28. Thank You Letter Viewer Experience

When a gift giver opens the app after receiving a thank-you letter:

- A modal appears
- The message is shown clearly
- The giver can dismiss it
- Once opened, the message is marked as seen
- The message remains available in a Thank You Messages section

---

## 29. Thank you letter early iteration constraints

This early iteration should not support:

- Replies
- Threads
- Rich text formatting
- Attachments
- Email delivery
- Push notification delivery
- Scheduled thank-you messages

The thank-you feature is in-app only.

---

## 30. Category-Based Item Fields

The app must support category-aware item forms.

Default categories:

1. Dorm / Apartment
2. Tech
3. Clothing
4. Accessories
5. School / Work Supplies
6. Self-Care
7. Food / Groceries
8. Experience
9. Cash Fund
10. Custom

---

## 31. Category Field Examples

### Dorm / Apartment

Required:

- Item name
- Quantity
- Description

Optional:

- Size
- Color
- Brand
- Dimensions
- Material
- Product link
- Price reference

### Tech

Required:

- Item name
- Description

Optional:

- Brand
- Model
- Storage
- Color
- Compatibility notes
- Product link
- Price reference

### Clothing

Required:

- Item name
- Size
- Quantity

Optional:

- Color
- Brand
- Fit preference
- Alternative sizes
- Product link
- Price reference

### Accessories

Required:

- Item name
- Quantity

Optional:

- Color
- Brand
- Style notes
- Product link
- Price reference

### School / Work Supplies

Required:

- Item name
- Quantity

Optional:

- Brand
- Specification
- Product link
- Price reference

### Self-Care

Required:

- Item name
- Quantity

Optional:

- Brand
- Scent
- Skin/hair type compatibility
- Restrictions or preferences
- Product link

### Food / Groceries

Required:

- Item name
- Quantity

Optional:

- Brand
- Flavor
- Dietary restrictions
- Expiration concerns
- Product link

### Experience

Required:

- Experience title
- Description

Optional:

- Estimated cost
- Preferred date
- Location
- Notes

### Cash Fund

Required:

- Fund title
- Description

Optional:

- Target amount
- Suggested contribution

### Custom

Required:

- Item name
- Description

Optional:

- Custom fields

---

## 32. UX Requirements

The app must feel:

- Modern
- Calm
- Premium
- Simple
- Mobile-first
- Familiar to users of modern apps

It should use UX patterns common in premium social media products without adding social features.

Use:

- Feed-style scrolling
- Card-based item layouts
- Fast actions
- Floating primary actions
- Bottom navigation on mobile
- Smooth modals
- Clear visual hierarchy
- Large touch targets
- Minimal clutter
- Friendly empty states

Do not include:

- Public feeds
- Comments
- Likes
- Follows
- Social sharing feeds

---

## 33. Core User Flows

## 33.1 Owner Creates Registry

1. Owner logs in with Google
2. Owner creates registry
3. Owner adds title, message, graduation date, reveal date/time
4. App generates code and share link
5. Owner adds items and cash funds
6. Owner shares link/code externally

---

## 33.2 Viewer Joins Registry

1. Viewer logs in with Google
2. Viewer enters registry code or opens invite link
3. Viewer joins registry
4. Viewer sees available items and cash funds

---

## 33.3 Viewer Reserves or Prepares Item

1. Viewer opens item
2. Viewer selects quantity
3. Viewer clicks Reserve
4. Viewer may later mark as Prepared
5. App updates item status

---

## 33.4 Viewer Pledges Money

1. Viewer opens cash fund
2. Viewer enters amount
3. Viewer confirms pledge
4. App records pledge
5. Owner sees pledge total only if allowed before reveal

---

## 33.5 Scheduled Reveal

1. Reveal date/time arrives
2. App unlocks contributor visibility
3. Owner can view who prepared what
4. Owner can view pledge details
5. Thank-you letter feature becomes available

---

## 33.6 Owner Sends Thank You Letter

1. Owner opens reveal page
2. Owner selects a giver/item/pledge
3. Owner writes thank-you message
4. Owner sends message
5. Giver sees pop-up next time they open app

---

## 34. Functional Acceptance Criteria

### Authentication

- User can log in with Google
- User session persists
- User can log out

### Registry

- Owner can create registry
- Registry generates unique code
- Registry has shareable link
- Viewer can join using code/link

### Items

- Owner can add item
- Owner can edit item
- Owner can archive item
- Owner can set category
- Category-specific fields appear correctly

### Reservation

- Viewer can reserve available quantity
- Viewer cannot exceed available quantity
- Viewer can mark reserved item as prepared

### Cash Pledge

- Viewer can pledge an amount
- Pledge is stored
- Pledge contributor hidden before reveal

### Reveal

- Contributor identities hidden before reveal
- Contributor identities visible after reveal
- Reveal happens based on owner-set date/time

### Thank You

- Owner can send thank-you message after reveal
- Giver sees message pop-up on next app open
- Message can be marked as seen

---

## 35. Non-Functional Requirements

### Performance

- Initial page load should feel fast
- Registry item list should render smoothly
- Interactions should respond immediately

### Security

- All protected routes require authentication
- Users can only access registries they joined
- Owner-only actions must be protected
- Viewer identity must remain hidden before reveal

### Privacy

- Gift giver identity must not leak before reveal
- Pledge details must not leak before reveal
- Thank-you messages are only visible to intended giver

### Responsiveness

- App must work well on mobile, tablet, and desktop
- Mobile experience is the priority

---

## 36. Recommended early iteration pages

1. Landing Page
2. Login Page
3. Dashboard
4. Create Registry Page
5. Registry Owner View
6. Registry Viewer View
7. Add/Edit Item Page or Modal
8. Item Detail Modal
9. Cash Fund Detail Modal
10. Reveal Page
11. Thank You Messages Page
12. Settings/Profile Page

---

## 37. Early iteration success metrics

- Number of registries created
- Number of items added per registry
- Number of viewers joined per registry
- Percentage of items reserved/prepared
- Number of pledges made
- Number of reveal events completed
- Number of thank-you messages sent
