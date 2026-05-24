"use client";

import cn from "classnames";

import { PROMO_CODE_SOURCE_LABELS } from "@/src/entities/promo-code/config";
import { useMyPromoCodes } from "@/src/entities/promo-code/model";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Badge, Button, Link, Title, Toast } from "@/src/shared/ui";

import styles from "./ProfilePromoCodes.module.css";
import { ProfilePromoCodesProps } from "./ProfilePromoCodes.props";

export const ProfilePromoCodes = ({ className }: ProfilePromoCodesProps) => {
  const { data, isLoading, isError, error } = useMyPromoCodes();
  const { showToast, toastProps } = useToast();

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast("Промокод скопирован", { appearance: "success" });
    } catch {
      showToast("Не удалось скопировать промокод", { appearance: "danger" });
    }
  };

  return (
    <section className={cn(className, styles.section)} aria-labelledby="profile-promo-title">
      <Title id="profile-promo-title" className={styles.title} tag="h2" size="md">
        Промокоды
      </Title>
      <p className={styles.hint}>
        Примените промокод в корзине при оформлении заказа. Каждый промокод одноразовый.
      </p>

      {isLoading && <p className={styles.state}>Загрузка...</p>}

      {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

      {!isLoading && !isError && data?.items.length === 0 && (
        <p className={styles.empty}>
          Сейчас нет доступных промокодов. Бонусный промокод появится после каждой 10-й оплаченной
          покупки.
        </p>
      )}

      {data && data.items.length > 0 && (
        <ul className={styles.list}>
          {data.items.map((promo) => (
            <li key={promo.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.discount}>Скидка {promo.discountPercent}%</p>
                <Badge className={styles.badge}>
                  {PROMO_CODE_SOURCE_LABELS[promo.source]}
                </Badge>
              </div>
              <p className={styles.code}>{promo.code}</p>
              <div className={styles.actions}>
                <Button
                  type="button"
                  appearance="ghost"
                  onClick={() => handleCopyCode(promo.code)}
                >
                  Скопировать
                </Button>
                <Link href={ROUTES.CART} appearance="primary">
                  В корзину
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Toast {...toastProps} />
    </section>
  );
};
