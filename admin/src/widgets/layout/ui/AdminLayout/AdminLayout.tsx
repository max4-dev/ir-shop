import { Button, Layout, Menu, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router";

import { authSelectors, useAuthStore } from "@src/features/auth";
import { ROUTES } from "@src/shared/config";
import { getErrorMessage } from "@src/shared/lib";

import styles from "./AdminLayout.module.css";

const { Header, Sider, Content } = Layout;

const MENU_ITEMS = [
  { key: ROUTES.DASHBOARD, label: <Link to={ROUTES.DASHBOARD}>Дашборд</Link> },
  { key: ROUTES.PRODUCTS.ROOT, label: <Link to={ROUTES.PRODUCTS.ROOT}>Товары</Link> },
  { key: ROUTES.ORDERS.ROOT, label: <Link to={ROUTES.ORDERS.ROOT}>Заказы</Link> },
  { key: ROUTES.CATEGORIES.ROOT, label: <Link to={ROUTES.CATEGORIES.ROOT}>Категории</Link> },
  { key: ROUTES.USERS.ROOT, label: <Link to={ROUTES.USERS.ROOT}>Пользователи</Link> },
  { key: ROUTES.PROMO_CODES.ROOT, label: <Link to={ROUTES.PROMO_CODES.ROOT}>Промокоды</Link> },
];

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(authSelectors.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    } catch (error) {
      console.error(getErrorMessage(error));
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  };

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" className={styles.sider} collapsedWidth={0}>
        <div className={styles.logo}>
          <Typography.Text strong>IR Shop Admin</Typography.Text>
        </div>
        <Menu items={MENU_ITEMS} mode="inline" selectedKeys={[location.pathname]} theme="dark" />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Typography.Title className={styles.title} level={4}>
            {title}
          </Typography.Title>
          <Button onClick={handleLogout}>Выйти</Button>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
