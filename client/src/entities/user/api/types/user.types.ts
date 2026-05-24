export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  pendingEmail: string | null;
  emailVerifiedAt: string | null;
  name: string;
  role: UserRole;
}

export interface UpdateProfileBody {
  name: string;
  email: string;
}

export interface UpdatePasswordBody {
  password: string;
  newPassword: string;
}

export interface UpdatePasswordResult {
  message: string;
}
