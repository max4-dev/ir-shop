import { Button } from "antd";
import { Link } from "react-router";

import { ROUTES } from "@src/shared/config";
import { AdminLayout } from "@src/widgets/layout";
import { ProductsTable } from "@src/widgets/product";

import styles from "./ProductsPage.module.css";

export const ProductsPage = () => {
  return (
    <AdminLayout title="Товары">
      <div className={styles.toolbar}>
        <Link to={ROUTES.PRODUCTS.CREATE}>
          <Button type="primary">Создать товар</Button>
        </Link>
      </div>
      <ProductsTable />
    </AdminLayout>
  );
};
