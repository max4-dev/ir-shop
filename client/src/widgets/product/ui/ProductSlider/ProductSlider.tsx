"use client";

import cn from "classnames";
import { SwiperSlide } from "swiper/react";

import { PRODUCT_SLIDER_BREAKPOINTS } from "@/src/entities/product/config";
import { ProductCard } from "@/src/entities/product/ui";
import { CartButton } from "@/src/features/cart/ui";
import { FavoriteButton } from "@/src/features/favorite/ui";
import { Link, Swiper, Title } from "@/src/shared/ui";

import styles from "./ProductSlider.module.css";
import { ProductSliderProps } from "./ProductSlider.props";

export const ProductSlider = ({
  className,
  products,
  title,
  moreHref,
  moreLabel = "Смотреть все",
}: ProductSliderProps) => {
  if (products.length === 0) return null;

  return (
    <section className={cn(className, styles.section)}>
      {(title || moreHref) && (
        <div className={styles.header}>
          {title && (
            <Title tag="h2" size="lg">
              {title}
            </Title>
          )}
          {moreHref && (
            <Link href={moreHref} appearance="ghost" size="small" className={styles.headerLink}>
              {moreLabel}
            </Link>
          )}
        </div>
      )}

      <Swiper
        className={styles.slider}
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={PRODUCT_SLIDER_BREAKPOINTS}
        watchOverflow
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className={styles.slide}>
            <ProductCard
              product={product}
              leftButtonSlot={<FavoriteButton productId={product.id} />}
              rightButtonSlot={
                <CartButton productId={product.id} disabled={!product.isAvailable} />
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
