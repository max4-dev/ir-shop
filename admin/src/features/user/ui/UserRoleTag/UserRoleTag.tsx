import { Tag } from "antd";

import { UserRole } from "@src/entities/user";

import { USER_ROLE_COLORS, USER_ROLE_LABELS } from "../../config/user.labels";

type UserRoleTagProps = {
  role: (typeof UserRole)[keyof typeof UserRole];
};

export const UserRoleTag = ({ role }: UserRoleTagProps) => (
  <Tag color={USER_ROLE_COLORS[role]}>{USER_ROLE_LABELS[role]}</Tag>
);
