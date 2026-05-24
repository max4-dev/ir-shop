"use client";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PRODUCT_SEARCH_MIN_LENGTH } from "@/src/entities/product/api";
import { useProductSearch } from "@/src/entities/product/model";
import { Icon } from "@/src/shared/assets";
import { ROUTES } from "@/src/shared/config";
import { formatPrice } from "@/src/shared/lib";
import { useDebouncedValue } from "@/src/shared/lib/hooks";
import { Input, Popover } from "@/src/shared/ui";

import styles from "./Search.module.css";
import { SearchProps } from "./Search.props";

const SUGGESTIONS_LIMIT = 5;

export const Search = ({ className, ...props }: SearchProps) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedValue = useDebouncedValue(value, 300);
  const trimmedDebounced = debouncedValue.trim();
  const showSuggestions = isFocused && trimmedDebounced.length >= PRODUCT_SEARCH_MIN_LENGTH;

  const { data, isLoading } = useProductSearch(
    debouncedValue,
    { limit: SUGGESTIONS_LIMIT },
    { enabled: showSuggestions },
  );

  const products = data?.products ?? [];

  const closeSuggestions = () => setIsFocused(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) closeSuggestions();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < PRODUCT_SEARCH_MIN_LENGTH) return;
    closeSuggestions();
    router.push(ROUTES.SEARCH.withQuery(trimmed));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSuggestions();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(className, styles.search)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <Popover open={showSuggestions} onOpenChange={handleOpenChange} modal={false}>
        <Popover.Anchor asChild>
          <div>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Поиск товаров..."
              icon={<Icon.Search />}
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="search-suggestions"
            />
          </div>
        </Popover.Anchor>

        <Popover.Content
          id="search-suggestions"
          className={styles.suggestions}
          sideOffset={8}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {isLoading && <p className={styles.state}>Загрузка...</p>}

          {!isLoading && products.length === 0 && (
            <p className={styles.state}>Ничего не найдено</p>
          )}

          {!isLoading &&
            products.map((product) => (
              <Link
                key={product.id}
                href={ROUTES.PRODUCTS.DETAIL(product.slug)}
                className={styles.item}
                onClick={closeSuggestions}
              >
                <Image
                  className={styles.image}
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                />
                <div className={styles.info}>
                  <span className={styles.name}>{product.name}</span>
                  <span className={styles.price}>{formatPrice(product.priceWithSale)}</span>
                </div>
              </Link>
            ))}

          {!isLoading && products.length > 0 && (
            <>
              <div className={styles.separator} role="separator" />
              <Link
                href={ROUTES.SEARCH.withQuery(trimmedDebounced)}
                className={styles.viewAll}
                onClick={closeSuggestions}
              >
                Все результаты
              </Link>
            </>
          )}
        </Popover.Content>
      </Popover>
    </form>
  );
};
