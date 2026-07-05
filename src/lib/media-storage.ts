import "server-only";

export type ProductMediaKind = "cover" | "gallery" | "video";

const DEFAULT_PRODUCT_MEDIA_BUCKET = "mushroom-product-media";
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

declare global {
  var __mushroomProductMediaBucketPromise: Promise<void> | undefined;
}

type StorageConfig = {
  bucket: string;
  serviceRoleKey: string;
  supabaseUrl: string;
};

function getStorageConfig(): StorageConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    "";
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET?.trim() ||
    process.env.PRODUCT_MEDIA_BUCKET?.trim() ||
    DEFAULT_PRODUCT_MEDIA_BUCKET;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase Storage is not configured.");
  }

  return {
    bucket,
    serviceRoleKey,
    supabaseUrl: supabaseUrl.replace(/\/+$/, ""),
  };
}

function getAllowedMimeTypes(kind: ProductMediaKind) {
  return kind === "video" ? VIDEO_MIME_TYPES : IMAGE_MIME_TYPES;
}

function getMaxBytes(kind: ProductMediaKind) {
  return kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

function getExtension(fileName: string, contentType: string) {
  const mimeExtension: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/webm": "webm",
  };
  const extensionFromMime = mimeExtension[contentType];

  if (extensionFromMime) {
    return extensionFromMime;
  }

  const extensionFromName = fileName.split(".").pop()?.toLowerCase() ?? "";

  return /^[a-z0-9]{2,5}$/.test(extensionFromName)
    ? extensionFromName
    : "bin";
}

function encodeObjectPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function readStorageError(response: Response) {
  const text = await response.text().catch(() => "");

  if (!text) {
    return response.statusText || "Storage request failed.";
  }

  try {
    const payload = JSON.parse(text) as { error?: string; message?: string };
    return payload.message || payload.error || text;
  } catch {
    return text;
  }
}

function isAlreadyExistsError(status: number, message: string) {
  return (
    status === 409 ||
    /already exists|duplicate|23505/i.test(message)
  );
}

async function ensureProductMediaBucket(config: StorageConfig) {
  if (!globalThis.__mushroomProductMediaBucketPromise) {
    globalThis.__mushroomProductMediaBucketPromise = (async () => {
      const headers = {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
      };
      const bucketBody = {
        allowed_mime_types: [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES],
        file_size_limit: MAX_VIDEO_BYTES,
        id: config.bucket,
        name: config.bucket,
        public: true,
      };

      const createResponse = await fetch(`${config.supabaseUrl}/storage/v1/bucket`, {
        body: JSON.stringify(bucketBody),
        headers,
        method: "POST",
      });

      if (!createResponse.ok) {
        const message = await readStorageError(createResponse);

        if (!isAlreadyExistsError(createResponse.status, message)) {
          throw new Error(message);
        }
      }

      await fetch(`${config.supabaseUrl}/storage/v1/bucket/${config.bucket}`, {
        body: JSON.stringify(bucketBody),
        headers,
        method: "PUT",
      }).catch(() => undefined);
    })();
  }

  try {
    await globalThis.__mushroomProductMediaBucketPromise;
  } catch (error) {
    globalThis.__mushroomProductMediaBucketPromise = undefined;
    throw error;
  }
}

export function isProductMediaKind(value: unknown): value is ProductMediaKind {
  return value === "cover" || value === "gallery" || value === "video";
}

export function validateProductMediaFile(file: File, kind: ProductMediaKind) {
  const allowedMimeTypes = getAllowedMimeTypes(kind);

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      kind === "video"
        ? "Video must be MP4, WEBM, or MOV."
        : "Image must be JPG, PNG, or WEBP.",
    );
  }

  if (file.size <= 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > getMaxBytes(kind)) {
    throw new Error(
      kind === "video"
        ? "Video file is too large. Please keep it under 25MB."
        : "Image file is too large. Please keep it under 6MB.",
    );
  }
}

export async function uploadProductMediaFile(file: File, kind: ProductMediaKind) {
  validateProductMediaFile(file, kind);

  const config = getStorageConfig();
  await ensureProductMediaBucket(config);

  const now = new Date();
  const year = now.getUTCFullYear().toString();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const extension = getExtension(file.name, file.type);
  const objectPath = [
    "products",
    kind,
    year,
    month,
    `${crypto.randomUUID()}.${extension}`,
  ].join("/");
  const encodedPath = encodeObjectPath(objectPath);
  const uploadResponse = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${encodedPath}`,
    {
      body: file,
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Cache-Control": "31536000",
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      method: "POST",
    },
  );

  if (!uploadResponse.ok) {
    throw new Error(await readStorageError(uploadResponse));
  }

  return {
    contentType: file.type,
    fileName: file.name,
    path: objectPath,
    size: file.size,
    url: `${config.supabaseUrl}/storage/v1/object/public/${config.bucket}/${encodedPath}`,
  };
}
