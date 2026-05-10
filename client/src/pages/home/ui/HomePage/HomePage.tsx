"use client";

import { useCategories } from "@/src/entities/category/model";
import { Container, Link } from "@/src/shared/ui";

export const HomePage = () => {
  const { data: categories } = useCategories();
  return (
    <Container>
      <h1>Home</h1>
      <Link href="/products">Все Продукты</Link>
      {categories?.map((category) => (
        <Link key={category.id} href={`/products/category/${category.slug}`}>
          {category.name}
        </Link>
      ))}
    </Container>
  );
};
