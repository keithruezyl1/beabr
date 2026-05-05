function toNumberOrNull(value) {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Thousands separator with commas (e.g. 9995 -> "9,995"). */
export function formatNumberDots(value, { maximumFractionDigits = 0, minimumFractionDigits = 0 } = {}) {
  const n = toNumberOrNull(value);
  if (n == null) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits, minimumFractionDigits }).format(n);
}

/** Peso currency with comma grouping (e.g. 9995 -> "₱9,995"). */
export function formatPesoDots(value, { maximumFractionDigits = 2, minimumFractionDigits = 0 } = {}) {
  const n = toNumberOrNull(value);
  if (n == null) return "";
  return `₱${formatNumberDots(n, { maximumFractionDigits, minimumFractionDigits })}`;
}

/** Removes commas/spaces and returns digits only (integer). */
export function sanitizeIntegerInput(raw) {
  return String(raw ?? "").replace(/[^\d]/g, "");
}

/** Formats a raw user input string as comma-grouped integer (e.g. "9995" -> "9,995"). */
export function formatIntegerInput(raw) {
  const digits = sanitizeIntegerInput(raw);
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Parses a formatted integer input string into a number, or null. */
export function parseIntegerInput(raw) {
  const digits = sanitizeIntegerInput(raw);
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

