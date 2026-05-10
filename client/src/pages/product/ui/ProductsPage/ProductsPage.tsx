"use client";

import cn from "classnames";
import Link from "next/link";

import { useProducts } from "@/src/entities/product/model";
import { Breadcrumb, Container } from "@/src/shared/ui";
import { ProductList } from "@/src/widgets/product/ui";

import styles from "./ProductsPage.module.css";

export const ProductsPage = () => {
  const { data: products } = useProducts();
  return (
    <div className={cn(styles.products)}>
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
              <Breadcrumb.Page>Все продукты</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        {products && <ProductList products={products} />}
      </Container>
    </div>
  );
};
