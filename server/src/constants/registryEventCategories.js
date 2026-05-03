const { z } = require("zod");

/** Gifting occasions for a registry—shown on create and on the registry profile card. */
const REGISTRY_EVENT_CATEGORIES = Object.freeze([
  "Celebration",
  "Graduation",
  "Wedding",
  "Birthday",
  "Baby shower",
  "Housewarming",
  "Retirement",
  "Farewell",
  "Fundraiser",
  "Other",
]);

const registryEventCategorySchema = z.enum([
  REGISTRY_EVENT_CATEGORIES[0],
  ...REGISTRY_EVENT_CATEGORIES.slice(1),
]);

module.exports = {
  REGISTRY_EVENT_CATEGORIES,
  registryEventCategorySchema,
};
