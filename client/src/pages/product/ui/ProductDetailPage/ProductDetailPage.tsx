import Link from "next/link";

import { serverProductQuery } from "@/src/entities/product/api";
import { ROUTES } from "@/src/shared/config";
import { formatPrice } from "@/src/shared/lib";
import { Badge, Breadcrumb, Container, Dropdown, Separator, Title } from "@/src/shared/ui";
import { ProductImageGallery } from "@/src/widgets/product/ui";

import styles from "./ProductDetailPage.module.css";

export const ProductDetailPage = async ({ slug }: { slug: string }) => {
  const product = await serverProductQuery.getBySlug(slug);
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
            {product.categories.length > 1 ? (
              <Dropdown>
                <Dropdown.Trigger>
                  <Breadcrumb.Page>Категории</Breadcrumb.Page>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {product.categories.map((category) => (
                    <Dropdown.Item asChild key={category.id}>
                      <Link href={ROUTES.PRODUCTS.BY_CATEGORY(category.slug)}>{category.name}</Link>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown>
            ) : (
              <Breadcrumb.Link asChild>
                <Link href={ROUTES.PRODUCTS.BY_CATEGORY(product.categories[0].slug)}>
                  {product.categories[0].name}
                </Link>
              </Breadcrumb.Link>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>{product.name}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      <article className={styles.layout}>
        <div className={styles.gallery}>
          <ProductImageGallery images={product.images} />
        </div>
        <div className={styles.info}>
          <Title className={styles.title} tag="h1" size="xl">
            {product.name}
          </Title>
          <div className={styles.priceBox}>
            {product.salePercent > 0 ? (
              <>
                <span className={styles.price}>{formatPrice(product.priceWithSale)}</span>
                <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                <Badge appearance="danger" size="lg">{`-${product.salePercent}%`}</Badge>
              </>
            ) : (
              <span className={styles.price}>{formatPrice(product.price)}</span>
            )}
          </div>
          <p className={styles.text}>{product.description}</p>
          <Separator indents="md" />
          <div className={styles.categories}>
            <p className={styles.text}>Категории</p>
            <div className={styles.categoryList}>
              {product.categories.map((category) => (
                <Link href={ROUTES.PRODUCTS.BY_CATEGORY(category.slug)} key={category.id}>
                  <Badge size="lg">{category.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <Separator indents="md" />
        </div>
      </article>
    </Container>
  );
};
