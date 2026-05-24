import { Modal, message } from "antd";

import { useCreateCategory } from "@src/entities/category";
import { getErrorMessage } from "@src/shared/lib";

import type { CategoryFormData } from "../../model";
import { CategoryForm } from "../CategoryForm/CategoryForm";

type CreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateCategoryModal = ({ open, onClose }: CreateCategoryModalProps) => {
  const { mutateAsync, isPending } = useCreateCategory();

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await mutateAsync(data);
      message.success("Категория создана");
      onClose();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Modal destroyOnClose footer={null} open={open} title="Новая категория" onCancel={onClose}>
      <CategoryForm isLoading={isPending} submitText="Создать" onSubmit={handleSubmit} />
    </Modal>
  );
};
