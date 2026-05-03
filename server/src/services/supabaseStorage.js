const path = require("path");
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { config } = require("../config");
const { httpError } = require("../utils/httpErrors");

function getAdminClient() {
  if (!config.isSupabaseConfigured) {
    throw httpError(500, "Supabase Storage is not configured.", {
      requiredEnv: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET"],
    });
  }
  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Maps known image MIME types (lowercase) to a stable file extension. */
const MIME_TO_EXT = {
  "image/png": "png",
  "image/x-png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/heif-sequence": "heif",
};

/** Extension → Content-Type when the client sends octet-stream or an empty MIME type. */
const EXT_TO_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
};

const FILENAME_TO_EXT = {
  ".png": "png",
  ".jpg": "jpg",
  ".jpeg": "jpg",
  ".webp": "webp",
  ".gif": "gif",
  ".avif": "avif",
  ".heic": "heic",
  ".heif": "heif",
};

function resolveImageFormat(file) {
  const mime =
    typeof file.mimetype === "string" ? file.mimetype.toLowerCase().trim() : "";

  let ext = mime && MIME_TO_EXT[mime];

  if (!ext) {
    const fromName = path.extname(file.originalname || "").toLowerCase();
    ext = FILENAME_TO_EXT[fromName] || null;
  }

  if (!ext) {
    throw httpError(
      400,
      "Unsupported image type. Use PNG, JPG, WEBP, GIF, AVIF, or HEIC — or rename the file to include a valid extension."
    );
  }

  const contentType = EXT_TO_MIME[ext] || `image/${ext}`;
  return { ext, contentType };
}

function assertImageFile(file) {
  if (!file.buffer) throw httpError(400, "Missing file buffer.");
  if (file.size > 8 * 1024 * 1024) throw httpError(400, "Image too large (max 8MB).");
}

function makePath({ kind, registryId, itemId, userId, ext }) {
  return `pledges/${registryId}/${itemId}/${kind}/${userId}/${randomUUID()}.${ext}`;
}

/** Path for AES-GCM–sealed scan-to-pay QR uploads (opaque blob in bucket). */
function makeEncryptedPledgeQrPath({ registryId, itemId, userId }) {
  return `pledges/${registryId}/${itemId}/qr/${userId}/${randomUUID()}.qre`;
}

async function uploadImage({ kind, registryId, itemId, userId, file }) {
  assertImageFile(file);
  const { ext, contentType } = resolveImageFormat(file);

  const supabase = getAdminClient();
  const objectPath = makePath({ kind, registryId, itemId, userId, ext });

  const { error } = await supabase.storage
    .from(config.supabaseStorageBucket)
    .upload(objectPath, file.buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw httpError(500, "Upload failed.", { supabase: error.message });
  return objectPath;
}

async function uploadRegistryImage({ kind, registryId, entityId, file }) {
  assertImageFile(file);
  const { ext, contentType } = resolveImageFormat(file);

  const supabase = getAdminClient();
  const objectPath = `registry/${registryId}/${kind}/${entityId}/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(config.supabaseStorageBucket)
    .upload(objectPath, file.buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw httpError(500, "Upload failed.", { supabase: error.message });
  return objectPath;
}

/**
 * @param {Buffer} sealedBuffer Already includes BEABRQRV magic — upload as opaque bytes.
 */
async function uploadEncryptedPledgeQrBlob({ registryId, itemId, userId, sealedBuffer }) {
  if (!sealedBuffer?.length) throw httpError(400, "Missing sealed QR payload.");
  if (sealedBuffer.length > 8 * 1024 * 1024 + 128) throw httpError(400, "Sealed QR too large.");
  const supabase = getAdminClient();
  const objectPath = makeEncryptedPledgeQrPath({ registryId, itemId, userId });

  const { error } = await supabase.storage
    .from(config.supabaseStorageBucket)
    .upload(objectPath, sealedBuffer, {
      contentType: "application/octet-stream",
      upsert: false,
    });

  if (error) throw httpError(500, "Upload failed.", { supabase: error.message });
  return objectPath;
}

async function downloadBucketObject(objectPath) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.storage.from(config.supabaseStorageBucket).download(objectPath);
  if (error || !data) throw httpError(502, "Storage download failed.", { supabase: error?.message });
  return Buffer.from(await data.arrayBuffer());
}

async function signUrl(path, ttlSeconds = 60 * 10) {
  if (!path) return null;
  const supabase = getAdminClient();
  const { data, error } = await supabase.storage
    .from(config.supabaseStorageBucket)
    .createSignedUrl(path, ttlSeconds);
  if (error) throw httpError(500, "Failed to create signed URL.", { supabase: error.message });
  return data?.signedUrl ?? null;
}

/** Best-effort bulk delete of bucket objects (e.g. when removing a registry). */
async function removeStoragePaths(paths) {
  const unique = [...new Set((paths || []).filter(Boolean))];
  if (unique.length === 0) return;
  if (!config.isSupabaseConfigured) return;
  const supabase = getAdminClient();
  const batchSize = 100;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    // eslint-disable-next-line no-await-in-loop
    const { error } = await supabase.storage.from(config.supabaseStorageBucket).remove(batch);
    if (error) console.error("[supabaseStorage] remove failed:", error.message);
  }
}

module.exports = {
  uploadEncryptedPledgeQrBlob,
  downloadBucketObject,
  resolveImageFormat,
  uploadPledgeQr: ({ registryId, itemId, initiatorUserId, file }) =>
    uploadImage({ kind: "qr", registryId, itemId, userId: initiatorUserId, file }),
  uploadReceipt: ({ registryId, itemId, contributorUserId, file }) =>
    uploadImage({ kind: "receipt", registryId, itemId, userId: contributorUserId, file }),
  uploadItemImage: ({ registryId, itemId, file }) =>
    uploadRegistryImage({ kind: "items", registryId, entityId: itemId, file }),
  uploadFundImage: ({ registryId, fundId, file }) =>
    uploadRegistryImage({ kind: "funds", registryId, entityId: fundId, file }),
  signUrl,
  removeStoragePaths,
};

