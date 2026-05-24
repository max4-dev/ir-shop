"use client";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@/src/features/auth/model";
import { ROUTES } from "@/src/shared/config";
import { Container } from "@/src/shared/ui";

import styles from "./Footer.module.css";
import { FooterProps } from "./Footer.props";

const SHOP_LINKS = [
  { label: "Каталог", href: ROUTES.PRODUCTS.ALL },
  { label: "Поиск", href: ROUTES.SEARCH.ROOT },
  { label: "Избранное", href: ROUTES.FAVORITES },
  { label: "Корзина", href: ROUTES.CART },
  { label: "Заказы", href: ROUTES.ORDERS.ROOT },
] as const;

export const Footer = ({ className, ...props }: FooterProps) => {
  const year = new Date().getFullYear();
  const { isAuthenticated, logout } = useAuthStore(
    useShallow((state) => ({ isAuthenticated: state.isAuthenticated, logout: state.logout }))
  );

  return (
    <footer className={cn(className, styles.footer)} {...props}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image src="/images/logo.svg" width={120} height={19} alt="ir shop" />
            </Link>
            <p className={styles.tagline}>Интернет-магазин техники и аксессуаров</p>
          </div>

          <nav className={styles.nav} aria-label="Магазин">
            <p className={styles.navTitle}>Магазин</p>
            <ul className={styles.navList}>
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={styles.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.nav} aria-label="Аккаунт">
            <p className={styles.navTitle}>Аккаунт</p>
            <ul className={styles.navList}>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href={ROUTES.ORDERS.ROOT} className={styles.navLink}>
                      Мои заказы
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.PROFILE} className={styles.navLink}>
                      Профиль
                    </Link>
                  </li>
                  <li>
                    <button type="button" className={styles.navLink} onClick={() => logout()}>
                      Выйти
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className={styles.navLink}>
                      Вход
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className={styles.navLink}>
                      Регистрация
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© {year} IR Shop. Все права защищены.</p>
        </div>
      </Container>
    </footer>
  );
};
