"use client";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@/src/features/auth/model";
import { Search } from "@/src/features/search/ui";
import { Icon } from "@/src/shared/assets";
import { Dropdown } from "@/src/shared/ui";

import styles from "./Header.module.css";
import { HeaderProps } from "./Header.props";

export const Header = ({ className, ...props }: HeaderProps) => {
  const { isAuthenticated, logout } = useAuthStore(
    useShallow((state) => ({ isAuthenticated: state.isAuthenticated, logout: state.logout }))
  );

  return (
    <header className={cn(className, styles.header)} {...props}>
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <Link href="/">
              <Image src="/images/logo.svg" width={140} height={22} alt="Логотип ir shop" />
            </Link>
            <Search className={styles.search} />
            <div className={styles.actions}>
              <Link href="/favorites">
                <Icon.Favorite width={25} height={22} />
              </Link>
              <Link href="/cart">
                <Icon.Cart width={24} height={22} />
              </Link>
              <Dropdown>
                <Dropdown.Trigger>
                  <Icon.User width={24} height={24} />
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {isAuthenticated ? (
                    <>
                      <Dropdown.Item asChild>
                        <Link href="/profile">Профиль</Link>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <button onClick={() => logout()}>Выйти</button>
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item asChild>
                        <Link href="/login">Вход</Link>
                      </Dropdown.Item>
                      <Dropdown.Item asChild>
                        <Link href="/register">Регистрация</Link>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
