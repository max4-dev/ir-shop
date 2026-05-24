export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  pendingEmail: string | null;
  emailVerifiedAt: string | null;
  name: string;
  role: UserRole;
}

export interface DeleteUserResponse {
  message: string;
}
