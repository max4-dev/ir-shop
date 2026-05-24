import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useUsers, type User } from "@src/entities/user";
import {
  DeleteUserButton,
  UserEmailStatusTag,
  UserRoleTag,
  formatUserEmail,
} from "@src/features/user";

type UsersTableProps = {
  onView: (userId: string) => void;
};

export const UsersTable = ({ onView }: UsersTableProps) => {
  const { data, isLoading } = useUsers();

  const columns: ColumnsType<User> = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
      render: (_, user) => formatUserEmail(user),
    },
    {
      title: "Роль",
      key: "role",
      render: (_, user) => <UserRoleTag role={user.role} />,
    },
    {
      title: "Email статус",
      key: "emailStatus",
      render: (_, user) => <UserEmailStatusTag user={user} />,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, user) => (
        <Space>
          <Button size="small" type="link" onClick={() => onView(user.id)}>
            Подробнее
          </Button>
          <DeleteUserButton userId={user.id} userName={user.name} />
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} loading={isLoading} pagination={false} rowKey="id" />
  );
};
