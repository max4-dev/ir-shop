import { Descriptions, Modal, Spin } from "antd";

import { useUser, type User } from "@src/entities/user";

import { formatUserEmail } from "../../lib/user.helpers";
import { UserEmailStatusTag } from "../UserEmailStatusTag/UserEmailStatusTag";
import { UserRoleTag } from "../UserRoleTag/UserRoleTag";

type UserDetailsModalProps = {
  userId: string | null;
  onClose: () => void;
};

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(value)
      )
    : "—";

export const UserDetailsModal = ({ userId, onClose }: UserDetailsModalProps) => {
  const { data, isLoading } = useUser(userId);

  return (
    <Modal destroyOnClose footer={null} open={Boolean(userId)} title="Пользователь" onCancel={onClose}>
      {isLoading && <Spin />}
      {data && <UserDetailsContent user={data} />}
    </Modal>
  );
};

const UserDetailsContent = ({ user }: { user: User }) => (
  <Descriptions column={1} size="small">
    <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
    <Descriptions.Item label="Имя">{user.name}</Descriptions.Item>
    <Descriptions.Item label="Email">{formatUserEmail(user)}</Descriptions.Item>
    <Descriptions.Item label="Роль">
      <UserRoleTag role={user.role} />
    </Descriptions.Item>
    <Descriptions.Item label="Email статус">
      <UserEmailStatusTag user={user} />
    </Descriptions.Item>
    <Descriptions.Item label="Подтверждён">{formatDate(user.emailVerifiedAt)}</Descriptions.Item>
    {user.pendingEmail && (
      <Descriptions.Item label="Ожидает подтверждения">{user.pendingEmail}</Descriptions.Item>
    )}
  </Descriptions>
);
