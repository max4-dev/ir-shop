"use client";

import cn from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/src/shared/assets";
import { Input } from "@/src/shared/ui";

import styles from "./Search.module.css";
import { SearchProps } from "./Search.props";

export const Search = ({ className, ...props }: SearchProps) => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/products?query=${encodeURIComponent(value.trim())}`);
  };
  return (
    <form onSubmit={handleSearch} className={cn(className, styles.search)} {...props}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Поиск товаров..."
        icon={<Icon.Search />}
      />
    </form>
  );
};
