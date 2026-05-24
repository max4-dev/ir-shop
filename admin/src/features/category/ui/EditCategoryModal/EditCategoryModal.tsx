import { Modal, message } from "antd";

import { useUpdateCategory, type Category } from "@src/entities/category";
import { getErrorMessage } from "@src/shared/lib";

import type { CategoryFormData } from "../../model";
import { CategoryForm } from "../CategoryForm/CategoryForm";

type EditCategoryModalProps = {
  category: Category | null;
  onClose: () => void;
};

export const EditCategoryModal = ({ category, onClose }: EditCategoryModalProps) => {
  const { mutateAsync, isPending } = useUpdateCategory();

  const handleSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    try {
      await mutateAsync({ id: category.id, data });
      message.success("Категория обновлена");
      onClose();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      destroyOnClose
      footer={null}
      open={Boolean(category)}
      title="Редактирование категории"
      onCancel={onClose}
    >
      <CategoryForm
        defaultValues={category ? { name: category.name } : undefined}
        isLoading={isPending}
        submitText="Сохранить"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
