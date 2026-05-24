import cn from "classnames";
import { Slider as SliderPrimitive } from "radix-ui";

import styles from "./Slider.module.css";
import {
  SliderProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderTrackProps,
} from "./Slider.props";

export const Slider = ({ className, children, ...props }: SliderProps) => {
  return (
    <SliderPrimitive.Root className={cn(className, styles.root)} {...props}>
      {children}
    </SliderPrimitive.Root>
  );
};

const Track = ({ className, children, ...props }: SliderTrackProps) => {
  return (
    <SliderPrimitive.Track className={cn(className, styles.track)} {...props}>
      {children}
    </SliderPrimitive.Track>
  );
};

const Range = ({ className, ...props }: SliderRangeProps) => {
  return <SliderPrimitive.Range className={cn(className, styles.range)} {...props} />;
};

const Thumb = ({ className, ...props }: SliderThumbProps) => {
  return <SliderPrimitive.Thumb className={cn(className, styles.thumb)} {...props} />;
};

Slider.Track = Track;
Slider.Range = Range;
Slider.Thumb = Thumb;
