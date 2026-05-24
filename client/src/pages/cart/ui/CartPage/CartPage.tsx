"use client";

import Link from "next/link";

import { useCart } from "@/src/entities/cart/model";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { CartEmpty, CartItemList, CartSummary } from "@/src/widgets/cart/ui";

import styles from "./CartPage.module.css";

export const CartPage = () => {
  const { data: cart, isLoading, isError, error } = useCart();

  const isEmpty = !isLoading && cart?.items.length === 0;

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
              <Breadcrumb.Page>Корзина</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          Корзина
        </Title>

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {isEmpty && <CartEmpty />}

        {cart && cart.items.length > 0 && (
          <div className={styles.layout}>
            <CartItemList items={cart.items} />
            <CartSummary className={styles.summary} cart={cart} />
          </div>
        )}
      </Container>
    </div>
  );
};
