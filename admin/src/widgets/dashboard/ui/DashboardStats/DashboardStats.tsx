import { Card, Col, Row, Statistic } from "antd";
import { Link } from "react-router";

import { useCategories } from "@src/entities/category";
import { useOrders } from "@src/entities/order";
import { useProducts } from "@src/entities/product";
import { ROUTES } from "@src/shared/config";

import styles from "./DashboardStats.module.css";

type StatCardProps = {
  title: string;
  value?: number;
  loading?: boolean;
  to: string;
  placeholder?: string;
};

const StatCard = ({ title, value, loading, to, placeholder }: StatCardProps) => (
  <Link className={styles.link} to={to}>
    <Card className={styles.card} hoverable>
      {placeholder ? (
        <div className={styles.placeholder}>
          <span className={styles.placeholderTitle}>{title}</span>
          <span className={styles.placeholderText}>{placeholder}</span>
        </div>
      ) : (
        <Statistic loading={loading} title={title} value={value ?? 0} />
      )}
    </Card>
  </Link>
);

export const DashboardStats = () => {
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders({ limit: 1 });
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 1 });
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  return (
    <Row gutter={[16, 16]}>
      <Col lg={6} sm={12} xs={24}>
        <StatCard
          loading={isOrdersLoading}
          title="Заказы"
          to={ROUTES.ORDERS.ROOT}
          value={ordersData?.total}
        />
      </Col>
      <Col lg={6} sm={12} xs={24}>
        <StatCard
          loading={isProductsLoading}
          title="Товары"
          to={ROUTES.PRODUCTS.ROOT}
          value={productsData?.total}
        />
      </Col>
      <Col lg={6} sm={12} xs={24}>
        <StatCard
          loading={isCategoriesLoading}
          title="Категории"
          to={ROUTES.CATEGORIES.ROOT}
          value={categories?.length}
        />
      </Col>
      <Col lg={6} sm={12} xs={24}>
        <StatCard
          placeholder="Перейти к выдаче"
          title="Промокоды"
          to={ROUTES.PROMO_CODES.ROOT}
        />
      </Col>
    </Row>
  );
};
