const MAX_ITEM_IMAGES = 3;

/**
 * Resolved storage paths for an item (`imagePaths` first, then legacy `imagePath`).
 * @param {{ imagePaths?: string[] | null; imagePath?: string | null }} item
 */
function normalizeItemImagePaths(item) {
  const paths = Array.isArray(item?.imagePaths) ? item.imagePaths.filter((p) => typeof p === "string" && p.trim()) : [];
  const trimmed = paths.slice(0, MAX_ITEM_IMAGES);
  if (trimmed.length > 0) return trimmed;
  return item?.imagePath && String(item.imagePath).trim() ? [String(item.imagePath).trim()] : [];
}

/**
 * @param {number[]} order
 * @param {number} length
 */
function isValidImageOrder(order, length) {
  if (!Array.isArray(order) || order.length !== length) return false;
  const set = new Set(order);
  if (set.size !== order.length) return false;
  return order.every((i) => Number.isInteger(i) && i >= 0 && i < length);
}

module.exports = { normalizeItemImagePaths, isValidImageOrder, MAX_ITEM_IMAGES };
