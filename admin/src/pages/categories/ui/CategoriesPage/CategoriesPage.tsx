import { Button } from "antd";
import { useState } from "react";

import { type Category } from "@src/entities/category";
import { CreateCategoryModal, EditCategoryModal } from "@src/features/category";
import { CategoriesTable } from "@src/widgets/category";
import { AdminLayout } from "@src/widgets/layout";

import styles from "./CategoriesPage.module.css";

export const CategoriesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <AdminLayout title="Категории">
      <div className={styles.toolbar}>
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Создать категорию
        </Button>
      </div>

      <CategoriesTable onEdit={setEditingCategory} />

      <CreateCategoryModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} />
    </AdminLayout>
  );
};
