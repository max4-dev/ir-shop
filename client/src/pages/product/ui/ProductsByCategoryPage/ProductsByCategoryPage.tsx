"use client";

import Link from "next/link";

import { useProductsByCategory } from "@/src/entities/product/model";
import { ROUTES } from "@/src/shared/config";
import { Breadcrumb, Container } from "@/src/shared/ui";
import { ProductList } from "@/src/widgets/product/ui";

export const ProductsByCategoryPage = ({ category }: { category: string }) => {
  const { data } = useProductsByCategory(category);
  return (
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
              <Link href={ROUTES.PRODUCTS.ALL}>Все продукты</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>{data?.category.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      {data && <ProductList products={data.items} />}
    </Container>
  );
};
