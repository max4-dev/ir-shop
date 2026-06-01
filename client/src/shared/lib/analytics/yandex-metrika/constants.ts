const rawId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "";

export const YANDEX_METRIKA_ID = Number.parseInt(rawId, 10);

export const YANDEX_METRIKA_ENABLED =
  Number.isFinite(YANDEX_METRIKA_ID) && YANDEX_METRIKA_ID > 0;

export const YANDEX_METRIKA_INIT_OPTIONS = {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  accurateTrackBounce: true,
  trackLinks: true,
} as const;
