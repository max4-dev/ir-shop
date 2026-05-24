import { Button, Popconfirm, message } from "antd";

import { useDeleteProduct } from "@src/entities/product";
import { getErrorMessage } from "@src/shared/lib";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export const DeleteProductButton = ({ productId, productName }: DeleteProductButtonProps) => {
  const { mutateAsync, isPending } = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await mutateAsync(productId);
      message.success("Товар удалён");
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Popconfirm
      cancelText="Отмена"
      description={`Товар «${productName}» будет удалён`}
      okButtonProps={{ danger: true, loading: isPending }}
      okText="Удалить"
      title="Удалить товар?"
      onConfirm={handleDelete}
    >
      <Button danger size="small" type="link">
        Удалить
      </Button>
    </Popconfirm>
  );
};
