import { Button, Popconfirm, message } from "antd";

import { useDeleteCategory } from "@src/entities/category";
import { getErrorMessage } from "@src/shared/lib";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

export const DeleteCategoryButton = ({ categoryId, categoryName }: DeleteCategoryButtonProps) => {
  const { mutateAsync, isPending } = useDeleteCategory();

  const handleDelete = async () => {
    try {
      const response = await mutateAsync(categoryId);
      message.success(response.message);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Popconfirm
      cancelText="Отмена"
      description={`Категория «${categoryName}» будет удалена`}
      okButtonProps={{ danger: true, loading: isPending }}
      okText="Удалить"
      title="Удалить категорию?"
      onConfirm={handleDelete}
    >
      <Button danger size="small" type="link">
        Удалить
      </Button>
    </Popconfirm>
  );
};
