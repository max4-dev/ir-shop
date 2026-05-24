"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { useProfile } from "@/src/entities/user/model";
import { useAuthStore } from "@/src/features/auth/model";
import { PasswordForm, ProfileForm } from "@/src/features/profile/ui";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { ProfilePromoCodes } from "@/src/widgets/profile/ui";

import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isInitialized: state.isInitialized,
    }))
  );
  const { data: profile, isLoading, isError, error } = useProfile(
    isAuthenticated && isInitialized
  );

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href="/">Главная</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Профиль</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          Профиль
        </Title>

        {profile?.pendingEmail && (
          <p className={styles.notice} role="status">
            Ожидает подтверждения новый email: <strong>{profile.pendingEmail}</strong>. Проверьте
            почту и перейдите по ссылке из письма.
          </p>
        )}

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {profile && (
          <div className={styles.layout}>
            <div className={styles.main}>
              <section className={styles.section} aria-labelledby="profile-data-title">
                <Title id="profile-data-title" className={styles.sectionTitle} tag="h2" size="md">
                  Данные аккаунта
                </Title>
                <ProfileForm profile={profile} />
              </section>

              <section className={styles.section} aria-labelledby="profile-password-title">
                <Title id="profile-password-title" className={styles.sectionTitle} tag="h2" size="md">
                  Смена пароля
                </Title>
                <PasswordForm />
              </section>
            </div>

            <ProfilePromoCodes />
          </div>
        )}
      </Container>
    </div>
  );
};
