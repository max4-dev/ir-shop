"use client";

import Link from "next/link";

import { useOrders } from "@/src/entities/order/model";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Link as UiLink, Title } from "@/src/shared/ui";
import { OrderCard } from "@/src/widgets/order/ui";

import styles from "./OrdersPage.module.css";

export const OrdersPage = () => {
  const { data, isLoading, isError, error } = useOrders();

  const isEmpty = !isLoading && data?.items.length === 0;

  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href="/">Главная</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Мои заказы</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          Мои заказы
        </Title>

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {isEmpty && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>У вас пока нет заказов</p>
            <UiLink href={ROUTES.PRODUCTS.ALL} appearance="primary" className={styles.emptyLink}>
              Перейти в каталог
            </UiLink>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className={styles.list}>
            {data.items.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
