import cn from "classnames";

import { Card } from "@/src/shared/ui";

import { CartItem } from "../CartItem/CartItem";

import styles from "./CartItemList.module.css";
import { CartItemListProps } from "./CartItemList.props";

export const CartItemList = ({ className, items, ...props }: CartItemListProps) => {
  return (
    <Card className={cn(className)} {...props}>
      <ul className={styles.list}>
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </ul>
    </Card>
  );
};
