export const SUCCESS_MODAL_VARIANTS = {
  registry_created: {
    badgeLabel: "Success",
    title: "Registry created",
    subtitle: "Your reveal timer is set. Share the invite when you’re ready—givers stay private until reveal.",
    ctaLabel: "Open registry",
  },
  registry_joined: {
    badgeLabel: "Success",
    title: "You joined the registry",
    subtitle: "You can now reserve gifts, mark them prepared, or contribute to pledges—your name stays private until reveal.",
    ctaLabel: "Open registry",
  },
  item_added: {
    badgeLabel: "Success",
    title: "Item added",
    subtitle: "It’s now visible to gift givers. They can reserve it or contribute through a pledge if available.",
    ctaLabel: "Back to registry",
  },
  pledge_initiated: {
    badgeLabel: "Success",
    title: "Pledge enabled",
    subtitle: "Contributors can now send money using the payout details you provided.",
    ctaLabel: "Back to item",
  },
  pledge_contributed: {
    badgeLabel: "Success",
    title: "Contribution received",
    subtitle: "Your receipt was uploaded. The owner will see it in the pledge details.",
    ctaLabel: "Go back to registry",
  },
};

export function resolveSuccessModalVariant(key) {
  const k = String(key || "").trim();
  return SUCCESS_MODAL_VARIANTS[k] || null;
}

