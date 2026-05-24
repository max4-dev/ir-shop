import { Image, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router";

import { PRODUCT_PAGINATION, useProducts, type Product } from "@src/entities/product";
import { DeleteProductButton } from "@src/features/product";
import { ROUTES } from "@src/shared/config";
import { formatPrice } from "@src/shared/lib";

export const ProductsTable = () => {
  const { data, isLoading } = useProducts({ limit: PRODUCT_PAGINATION.DEFAULT_LIMIT });

  const columns: ColumnsType<Product> = [
    {
      title: "Фото",
      key: "image",
      render: (_, product) => (
        <Image alt={product.name} height={48} src={product.image} width={48} />
      ),
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Цена",
      key: "price",
      render: (_, product) =>
        product.salePercent > 0 ? (
          <Space direction="vertical" size={0}>
            <span>{formatPrice(product.priceWithSale)}</span>
            <span style={{ color: "var(--gray)", textDecoration: "line-through" }}>
              {formatPrice(product.price)}
            </span>
          </Space>
        ) : (
          formatPrice(product.price)
        ),
    },
    {
      title: "Категории",
      key: "categories",
      render: (_, product) => (
        <Space wrap>
          {product.categories.map((category) => (
            <Tag key={category.id}>{category.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Наличие",
      key: "availability",
      render: (_, product) =>
        product.isAvailable ? (
          <Tag color="green">{product.availableCount} шт.</Tag>
        ) : (
          <Tag color="red">Недоступен</Tag>
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, product) => (
        <Space>
          <Link to={ROUTES.PRODUCTS.DETAIL(product.id)}>Редактировать</Link>
          <DeleteProductButton productId={product.id} productName={product.name} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data?.products}
      loading={isLoading}
      pagination={{ total: data?.total }}
      rowKey="id"
    />
  );
};
