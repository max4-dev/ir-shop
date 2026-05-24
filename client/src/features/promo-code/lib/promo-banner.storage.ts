const STORAGE_KEY = "ir-shop:dismissed-promo-banners";

export const getDismissedPromoBannerIds = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export const dismissPromoBanner = (promoId: string): void => {
  const ids = getDismissedPromoBannerIds();
  if (ids.includes(promoId)) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, promoId]));
};
