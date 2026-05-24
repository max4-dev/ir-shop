"use client";

import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./ProductImageGallery.module.css";
import { ProductImageGalleryProps } from "./ProductImageGallery.props";

import type { Swiper as SwiperType } from "swiper/types";

const THUMBS_BREAKPOINTS = {
  480: {
    slidesPerView: 4,
  },
  768: {
    slidesPerView: 5,
  },
};

export const ProductImageGallery = ({ className, images, ...props }: ProductImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className={cn(className, styles.gallery)} {...props}>
      <Swiper
        spaceBetween={10}
        navigation={false}
        allowTouchMove
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
        breakpoints={THUMBS_BREAKPOINTS}
        scrollbar={false}
        modules={[Thumbs, FreeMode]}
        freeMode
        watchSlidesProgress
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
