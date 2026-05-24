import { Slider as SliderPrimitive } from "radix-ui";
import { ComponentPropsWithoutRef } from "react";

export interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

export interface SliderTrackProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Track> {}

export interface SliderRangeProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Range> {}

export interface SliderThumbProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb> {}
