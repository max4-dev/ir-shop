export const MEDIA_FIELD_NAME = 'media';

export const MEDIA_LIMITS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
} as const;

export const MEDIA_WEBP = {
  QUALITY: 100,
  CONTENT_TYPE: 'image/webp',
  EXTENSION: 'webp',
} as const;

export const MEDIA_PATH = {
  IMAGES_ROOT: 'images',
  FOLDER_PATTERN: /^[a-z0-9-]+(\/[a-z0-9-]+)*$/,
} as const;
