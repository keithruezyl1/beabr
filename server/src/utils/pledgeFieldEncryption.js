const crypto = require("crypto");
const { config } = require("../config");
const { httpError } = require("./httpErrors");

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

/** Stored text ciphertext prefix — legacy DB rows omit this prefix and are returned verbatim. */
const TEXT_PREFIX = "bea1.";
/** File magic prefixed to sealed `.qre` objects in Storage before the AES-GCM blob. */
const QRE_MAGIC = Buffer.from("BEABRQRV", "utf8");

const MIME_FOR_QR_PIXEL = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/heif"];

/** @returns {Buffer} */
function getKey() {
  const raw = config.pledgeEncryptionKeyBase64 || "";
  if (!raw.trim()) return null;
  let buf;
  try {
    buf = Buffer.from(raw.trim(), "base64");
  } catch (_e) {
    return null;
  }
  if (buf.length !== 32) return null;
  return buf;
}

function assertConfigured() {
  const k = getKey();
  if (!k) {
    throw httpError(
      500,
      "Pledge payouts require BEABR_PLEDGE_ENCRYPTION_KEY (32-byte value, base64-encoded).",
      { requiredEnv: ["BEABR_PLEDGE_ENCRYPTION_KEY"] },
      { exposeInProduction: true }
    );
  }
  return k;
}

/** @param {Buffer} plaintext */
function sealBinary(plaintext) {
  const key = assertConfigured();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN });
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]);
}

/** @param {Buffer} wire */
function openBinary(wire) {
  const key = assertConfigured();
  if (wire.length < IV_LEN + AUTH_TAG_LEN + 1) {
    throw httpError(500, "Invalid encrypted payload.");
  }
  const iv = wire.subarray(0, IV_LEN);
  const tag = wire.subarray(wire.length - AUTH_TAG_LEN);
  const ciphertext = wire.subarray(IV_LEN, wire.length - AUTH_TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/**
 * @param {string | null | undefined} plain
 * @returns {string | null | undefined}
 */
function sealPayoutUtf8String(plain) {
  assertConfigured();
  if (plain === null || typeof plain === "undefined") return plain;
  if (plain === "") return "";
  const wire = sealBinary(Buffer.from(plain, "utf8"));
  return `${TEXT_PREFIX}${wire.toString("base64url")}`;
}

/**
 * @param {string | null | undefined} stored
 * @returns {string | null | undefined}
 */
function openPayoutUtf8String(stored) {
  if (stored === null || typeof stored === "undefined") return stored;
  if (stored === "") return "";
  if (typeof stored !== "string") return stored;
  if (!stored.startsWith(TEXT_PREFIX)) return stored;

  assertConfigured();

  try {
    const wire = Buffer.from(stored.slice(TEXT_PREFIX.length), "base64url");
    return openBinary(wire).toString("utf8");
  } catch (_e) {
    throw httpError(500, "Could not decrypt stored payout detail. Encryption key mismatch or corrupted data.", {
      code: "PLEDGE_DECRYPT_FAILED",
    });
  }
}

/**
 * Encrypt scan-to-pay QR bytes for Storage (prefix + ciphertext wire).
 * @param {Buffer} rawImagePixelBuffer
 * @param {string} contentType e.g. image/png
 */
function sealQrImageBuffer(rawImagePixelBuffer, contentType) {
  assertConfigured();
  const mimeIdx = Math.max(0, MIME_FOR_QR_PIXEL.indexOf(contentType));
  const header = Buffer.from([mimeIdx]);
  const plain = Buffer.concat([header, rawImagePixelBuffer]);
  const boxed = sealBinary(plain);
  return Buffer.concat([QRE_MAGIC, boxed]);
}

/**
 * @param {Buffer} encryptedFile Bytes from Storage (possibly legacy raw image).
 * @param {string} objectPath Helps detect `.qre` sealed uploads.
 */
function openQrStorageBlob(encryptedFile, objectPath) {
  const isSealedFilename = /\.qre$/i.test(objectPath || "");
  let body = encryptedFile;
  if (
    encryptedFile.length >= QRE_MAGIC.length + IV_LEN + AUTH_TAG_LEN &&
    QRE_MAGIC.compare(encryptedFile.subarray(0, QRE_MAGIC.length)) === 0
  ) {
    body = encryptedFile.subarray(QRE_MAGIC.length);
  } else if (isSealedFilename) {
    /** Older experimental `.qre` without magic — tolerate raw AES-GCM wire. */
    body = encryptedFile;
  } else {
    return { legacy: true, contentType: sniffImageMime(encryptedFile), buffer: encryptedFile };
  }

  try {
    if (!config.pledgeEncryptionKeyBase64?.trim()) {
      throw httpError(500, "Cannot read encrypted pledge QR — BEABR_PLEDGE_ENCRYPTION_KEY is not set.", {
        requiredEnv: ["BEABR_PLEDGE_ENCRYPTION_KEY"],
      });
    }
    const decoded = openBinary(body);
    const mimeIdx = decoded[0];
    const contentType =
      MIME_FOR_QR_PIXEL[mimeIdx] != null ? MIME_FOR_QR_PIXEL[mimeIdx] : MIME_FOR_QR_PIXEL[0];
    const buffer = decoded.subarray(1);
    return { legacy: false, contentType, buffer };
  } catch (err) {
    if (err?.status) throw err;
    if (!isSealedFilename) {
      return { legacy: true, contentType: sniffImageMime(encryptedFile), buffer: encryptedFile };
    }
    throw httpError(400, "This QR image is encrypted but could not be decrypted.");
  }
}

function sniffImageMime(buf) {
  if (buf.length < 12) return "application/octet-stream";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return "image/webp";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  return "application/octet-stream";
}

module.exports = {
  assertPledgeEncryptionConfigured: assertConfigured,
  sealPayoutUtf8String,
  openPayoutUtf8String,
  sealQrImageBuffer,
  openQrStorageBlob,
  MIME_FOR_QR_PIXEL,
};
