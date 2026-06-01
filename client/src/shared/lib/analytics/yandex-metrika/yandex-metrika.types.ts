export type YandexMetrikaInitOptions = {
  ssr?: boolean;
  webvisor?: boolean;
  clickmap?: boolean;
  ecommerce?: string | boolean;
  referrer?: string;
  url?: string;
  accurateTrackBounce?: boolean;
  trackLinks?: boolean;
};

export type YandexMetrikaHitOptions = {
  referer?: string;
};

export type YandexMetrikaFn = {
  (counterId: number, method: "init", options: YandexMetrikaInitOptions): void;
  (counterId: number, method: "hit", url: string, options?: YandexMetrikaHitOptions): void;
};

declare global {
  interface Window {
    ym?: YandexMetrikaFn;
    dataLayer?: unknown[];
  }
}

export {};
