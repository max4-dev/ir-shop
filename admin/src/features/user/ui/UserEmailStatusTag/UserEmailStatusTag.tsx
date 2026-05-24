import { Tag } from "antd";

import type { User } from "@src/entities/user";

type UserEmailStatusTagProps = {
  user: User;
};

export const UserEmailStatusTag = ({ user }: UserEmailStatusTagProps) => {
  if (user.emailVerifiedAt) {
    return <Tag color="green">Подтверждён</Tag>;
  }

  return <Tag color="orange">Не подтверждён</Tag>;
};
