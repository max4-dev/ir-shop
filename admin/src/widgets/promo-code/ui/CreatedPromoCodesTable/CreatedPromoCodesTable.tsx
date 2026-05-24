import { Button, Space, Table, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { PromoCode } from "@src/entities/promo-code";
import { PromoCodeSourceTag } from "@src/features/promo-code";
import { formatDateTime } from "@src/shared/lib";

type CreatedPromoCodesTableProps = {
  items: PromoCode[];
  usersMap: Record<string, string>;
};

export const CreatedPromoCodesTable = ({ items, usersMap }: CreatedPromoCodesTableProps) => {
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      message.success("Промокод скопирован");
    } catch {
      message.error("Не удалось скопировать промокод");
    }
  };

  const columns: ColumnsType<PromoCode> = [
    {
      title: "Код",
      key: "code",
      render: (_, promoCode) => (
        <Space>
          <Typography.Text code>{promoCode.code}</Typography.Text>
          <Button size="small" type="link" onClick={() => handleCopy(promoCode.code)}>
            Копировать
          </Button>
        </Space>
      ),
    },
    {
      title: "Пользователь",
      key: "user",
      render: (_, promoCode) => usersMap[promoCode.userId] ?? promoCode.userId,
    },
    {
      title: "Скидка",
      key: "discountPercent",
      render: (_, promoCode) => `${promoCode.discountPercent}%`,
    },
    {
      title: "Источник",
      key: "source",
      render: (_, promoCode) => <PromoCodeSourceTag source={promoCode.source} />,
    },
    {
      title: "Создан",
      key: "createdAt",
      render: (_, promoCode) => formatDateTime(promoCode.createdAt),
    },
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <Table
      columns={columns}
      dataSource={items}
      pagination={false}
      rowKey="id"
      title={() => "Выданные в этой сессии"}
    />
  );
};
