import { UserRole } from "@src/entities/user";

type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Record<UserRoleValue, string> = {
  [UserRole.USER]: "Пользователь",
  [UserRole.ADMIN]: "Администратор",
};

export const USER_ROLE_COLORS: Record<UserRoleValue, string> = {
  [UserRole.USER]: "default",
  [UserRole.ADMIN]: "blue",
};
