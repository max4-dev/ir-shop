"use client";

import { Collapsible, VisuallyHidden } from "radix-ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useMyPromoCodes } from "@/src/entities/promo-code/model";
import { useAuthStore } from "@/src/features/auth/model";
import {
  dismissPromoBanner,
  getDismissedPromoBannerIds,
} from "@/src/features/promo-code/lib/promo-banner.storage";
import { ROUTES } from "@/src/shared/config";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Link, Toast } from "@/src/shared/ui";

import styles from "./PromoCodeBanner.module.css";

export const PromoCodeBanner = () => {
  const { isAuthenticated, isInitialized } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isInitialized: state.isInitialized,
    }))
  );
  const { data, isSuccess } = useMyPromoCodes(isAuthenticated && isInitialized);
  const { showToast, toastProps } = useToast();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDismissedIds(getDismissedPromoBannerIds());
  }, []);

  const activePromo = useMemo(() => {
    if (!data?.items.length) {
      return null;
    }
    return data.items.find((item) => !dismissedIds.includes(item.id)) ?? null;
  }, [data?.items, dismissedIds]);

  useEffect(() => {
    setIsOpen(Boolean(activePromo));
  }, [activePromo?.id]);

  const handleDismiss = useCallback(() => {
    if (!activePromo) {
      return;
    }
    dismissPromoBanner(activePromo.id);
    setDismissedIds((prev) => [...prev, activePromo.id]);
    setIsOpen(false);
  }, [activePromo]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleDismiss();
    }
  };

  const handleCopyCode = async () => {
    if (!activePromo) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activePromo.code);
      showToast("Промокод скопирован", { appearance: "success" });
    } catch {
      showToast("Не удалось скопировать промокод", { appearance: "danger" });
    }
  };

  if (!isAuthenticated || !isSuccess || !activePromo) {
    return null;
  }

  return (
    <>
      <Collapsible.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Collapsible.Content className={styles.banner}>
          <div className={styles.inner}>
            <div className={styles.text}>
              <p className={styles.title}>
                У вас промокод на скидку {activePromo.discountPercent}%
              </p>
              <p className={styles.description}>
                Примените его в корзине при оформлении заказа. Промокод одноразовый.
              </p>
              <p className={styles.code}>{activePromo.code}</p>
            </div>

            <div className={styles.actions}>
              <Button
                type="button"
                appearance="ghost"
                className={styles.copyButton}
                onClick={handleCopyCode}
              >
                Скопировать
              </Button>
              <Link href={ROUTES.CART} appearance="primary" className={styles.cartLink}>
                В корзину
              </Link>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleDismiss}
                aria-label="Закрыть"
              >
                <VisuallyHidden.Root>Закрыть уведомление о промокоде</VisuallyHidden.Root>
                <span aria-hidden>×</span>
              </button>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
      <Toast {...toastProps} />
    </>
  );
};
