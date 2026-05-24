import { Tag } from "antd";

import {
  PROMO_CODE_SOURCE_LABELS,
  PROMO_CODE_SOURCE_TAG_COLORS,
  type PromoCodeSource,
} from "@src/entities/promo-code";

type PromoCodeSourceTagProps = {
  source: PromoCodeSource;
};

export const PromoCodeSourceTag = ({ source }: PromoCodeSourceTagProps) => (
  <Tag color={PROMO_CODE_SOURCE_TAG_COLORS[source]}>{PROMO_CODE_SOURCE_LABELS[source]}</Tag>
);
