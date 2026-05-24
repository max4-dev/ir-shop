import { Card, Typography } from "antd";
import { useMemo, useState } from "react";

import type { PromoCode } from "@src/entities/promo-code";
import { useUsers } from "@src/entities/user";
import { CreatePromoCodeForm } from "@src/features/promo-code";
import { AdminLayout } from "@src/widgets/layout";
import { CreatedPromoCodesTable } from "@src/widgets/promo-code";

import styles from "./PromoCodesPage.module.css";

export const PromoCodesPage = () => {
  const [createdPromoCodes, setCreatedPromoCodes] = useState<PromoCode[]>([]);
  const { data: users } = useUsers();

  const usersMap = useMemo(
    () =>
      Object.fromEntries(
        (users ?? []).map((user) => [user.id, `${user.name} (${user.email})`])
      ),
    [users]
  );

  const handleCreated = (promoCode: PromoCode) => {
    setCreatedPromoCodes((prev) => [promoCode, ...prev]);
  };

  return (
    <AdminLayout title="Промокоды">
      <Typography.Paragraph className={styles.description} type="secondary">
        Промокод привязан к пользователю и одноразовый — после применения в заказе удаляется
        автоматически.
      </Typography.Paragraph>

      <Card className={styles.card} title="Выдать промокод">
        <CreatePromoCodeForm onCreated={handleCreated} />
      </Card>

      <CreatedPromoCodesTable items={createdPromoCodes} usersMap={usersMap} />
    </AdminLayout>
  );
};
