"use client";

import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./ProductImageGallery.module.css";
import { ProductImageGalleryProps } from "./ProductImageGallery.props";

import type { Swiper as SwiperType } from "swiper/types";

// const breakpoints = {
//   0: {
//     slidesPerView: 1.5,
//   },
//   320: {
//     slidesPerView: 2,
//   },
//   400: {
//     slidesPerView: 3,
//   },
//   768: {
//     slidesPerView: 4,
//   },
// };

export const ProductImageGallery = ({ className, images, ...props }: ProductImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className={cn(className, styles.gallery)} {...props}>
      <Swiper
        spaceBetween={10}
        navigation={false}
        allowTouchMove={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className={styles.slider}
      >
        {images.map((image, index) => (
          <SwiperSlide className={styles.sliderSlide} key={index}>
            <Image className={styles.sliderImg} src={image} width={530} height={444} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={14}
        slidesPerView={3}
        scrollbar={false}
        modules={[Thumbs]}
        // breakpoints={breakpoints}
        className={styles.sliderThumbs}
      >
        {images.map((image, index) => (
          <SwiperSlide className={styles.sliderThumb} key={index}>
            <Image className={styles.sliderImg} src={image} width={167} height={152} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
