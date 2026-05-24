"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";

import { PRODUCT_PRICE_FILTER } from "@/src/entities/product/config";
import { formatPrice } from "@/src/shared/lib";
import { useDebouncedValue } from "@/src/shared/lib/hooks";
import { Slider } from "@/src/shared/ui";

import styles from "./ProductPriceFilter.module.css";
import { ProductPriceFilterProps } from "./ProductPriceFilter.props";

const { MIN, MAX, STEP } = PRODUCT_PRICE_FILTER;

export const ProductPriceFilter = ({
  className,
  minPrice,
  maxPrice,
  onChange,
}: ProductPriceFilterProps) => {
  const displayMin = minPrice ?? MIN;
  const displayMax = maxPrice ?? MAX;

  const [value, setValue] = useState([displayMin, displayMax]);
  const debouncedValue = useDebouncedValue(value, 300);
  const isSyncingFromParent = useRef(false);

  useEffect(() => {
    isSyncingFromParent.current = true;
    setValue([displayMin, displayMax]);
  }, [displayMin, displayMax]);

  useEffect(() => {
    const [min, max] = debouncedValue;

    if (isSyncingFromParent.current) {
      if (min === displayMin && max === displayMax) {
        isSyncingFromParent.current = false;
      }
      return;
    }

    const nextMin = min <= MIN ? undefined : min;
    const nextMax = max >= MAX ? undefined : max;

    if (nextMin === minPrice && nextMax === maxPrice) return;

    onChange({ minPrice: nextMin, maxPrice: nextMax });
  }, [debouncedValue, displayMin, displayMax, minPrice, maxPrice, onChange]);

  const applyRange = (range: number[]) => {
    const [min, max] = range;
    const nextMin = min <= MIN ? undefined : min;
    const nextMax = max >= MAX ? undefined : max;
    onChange({ minPrice: nextMin, maxPrice: nextMax });
  };

  const [currentMin, currentMax] = value;

  return (
    <div className={cn(className, styles.filter)}>
      <div className={styles.values}>
        <span>{formatPrice(currentMin)}</span>
        <span>{formatPrice(currentMax)}</span>
      </div>

      <Slider
        className={styles.slider}
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onValueChange={setValue}
        onValueCommit={applyRange}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb />
        <Slider.Thumb />
      </Slider>
    </div>
  );
};
