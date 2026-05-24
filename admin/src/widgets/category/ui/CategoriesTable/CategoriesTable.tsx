import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useCategories, type Category } from "@src/entities/category";
import { DeleteCategoryButton } from "@src/features/category";

type CategoriesTableProps = {
  onEdit: (category: Category) => void;
};

export const CategoriesTable = ({ onEdit }: CategoriesTableProps) => {
  const { data, isLoading } = useCategories();

  const columns: ColumnsType<Category> = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, category) => (
        <Space>
          <Button size="small" type="link" onClick={() => onEdit(category)}>
            Редактировать
          </Button>
          <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={false}
      rowKey="id"
    />
  );
};
