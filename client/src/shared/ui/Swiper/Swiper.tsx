"use client";

import cn from "classnames";
import { Swiper as SwiperPrimitive, SwiperSlide } from "swiper/react";

import { SwiperProps } from "./Swiper.props";

export { SwiperSlide };

export const Swiper = ({ className, children, ...props }: SwiperProps) => {
  return (
    <SwiperPrimitive className={cn(className)} {...props}>
      {children}
    </SwiperPrimitive>
  );
};
