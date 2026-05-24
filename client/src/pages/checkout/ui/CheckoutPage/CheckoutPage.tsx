"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCart } from "@/src/entities/cart/model";
import { CheckoutForm } from "@/src/features/checkout/ui";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { CheckoutSummary } from "@/src/widgets/checkout/ui";

import styles from "./CheckoutPage.module.css";

export const CheckoutPage = () => {
  const router = useRouter();
  const { data: cart, isLoading, isError, error } = useCart();

  const isEmpty = !isLoading && cart?.items.length === 0;

  useEffect(() => {
    if (!isLoading && isEmpty) {
      router.replace(ROUTES.CART);
    }
  }, [isLoading, isEmpty, router]);

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
              <Breadcrumb.Link asChild>
                <Link href={ROUTES.CART}>Корзина</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Оформление заказа</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          Оформление заказа
        </Title>

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {cart && cart.items.length > 0 && (
          <div className={styles.layout}>
            <CheckoutForm cart={cart} />
            <CheckoutSummary className={styles.summary} cart={cart} />
          </div>
        )}
      </Container>
    </div>
  );
};
