import { Button, Popconfirm, message } from "antd";

import { useDeleteUser } from "@src/entities/user";
import { getErrorMessage } from "@src/shared/lib";

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
};

export const DeleteUserButton = ({ userId, userName }: DeleteUserButtonProps) => {
  const { mutateAsync, isPending } = useDeleteUser();

  const handleDelete = async () => {
    try {
      const response = await mutateAsync(userId);
      message.success(response.message);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Popconfirm
      cancelText="Отмена"
      description={`Пользователь «${userName}» будет удалён`}
      okButtonProps={{ danger: true, loading: isPending }}
      okText="Удалить"
      title="Удалить пользователя?"
      onConfirm={handleDelete}
    >
      <Button danger size="small" type="link">
        Удалить
      </Button>
    </Popconfirm>
  );
};
