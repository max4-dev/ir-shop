"use client";

import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

import { applyDiscountPercent } from "@/src/entities/promo-code/lib/apply-discount-percent";
import { useAuthStore } from "@/src/features/auth/model";
import { usePromoCodeStore, useValidatePromoCode } from "@/src/features/promo-code/model";
import { formatPrice, getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import styles from "./CartPromoCode.module.css";
import { CartPromoCodeProps } from "./CartPromoCode.props";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const CartPromoCode = ({ className, subtotal }: CartPromoCodeProps) => {
  const [code, setCode] = useState("");
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({ isAuthenticated: state.isAuthenticated })),
  );
  const { applied, setApplied, clearApplied } = usePromoCodeStore(
    useShallow((state) => ({
      applied: state.applied,
      setApplied: state.setApplied,
      clearApplied: state.clearApplied,
    })),
  );
  const { mutateAsync, isPending } = useValidatePromoCode();
  const { showToast, toastProps } = useToast();

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      showToast("Введите промокод", { appearance: "danger" });
      return;
    }
    if (!UUID_REGEX.test(trimmed)) {
      showToast("Некорректный формат промокода", { appearance: "danger" });
      return;
    }

    try {
      const result = await mutateAsync({ code: trimmed });
      setApplied({
        code: result.code,
        discountPercent: result.discountPercent,
      });
      setCode("");
      showToast(`Скидка ${result.discountPercent}% применена`, { appearance: "success" });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  const handleRemove = () => {
    clearApplied();
    showToast("Промокод отменён", { appearance: "success" });
  };

  const discountedTotal = applied
    ? applyDiscountPercent(subtotal, applied.discountPercent)
    : null;

  return (
    <div className={cn(className, styles.promo)}>
      {!isAuthenticated ? (
        <p className={styles.hint}>
          <Link className={styles.hintLink} href="/login">
            Войдите
          </Link>
          , чтобы использовать промокод
        </p>
      ) : applied ? (
        <div className={styles.applied}>
          <p className={styles.appliedText}>
            Промокод активен:{" "}
            <span className={styles.appliedDiscount}>-{applied.discountPercent}%</span>
            {discountedTotal !== null && (
              <>
                {" "}
                · итого {formatPrice(discountedTotal)}
              </>
            )}
          </p>
          <button type="button" className={styles.removeButton} onClick={handleRemove}>
            Убрать
          </button>
        </div>
      ) : (
        <div className={styles.field}>
          <Input
            className={styles.input}
            label="Промокод"
            placeholder="Введите промокод"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            disabled={isPending}
          />
          <Button
            type="button"
            appearance="ghost"
            className={styles.applyButton}
            disabled={isPending}
            onClick={handleApply}
          >
            {isPending ? "..." : "Применить"}
          </Button>
        </div>
      )}
      <Toast {...toastProps} />
    </div>
  );
};
